(function() {
  ExtMVC.Model.plugin.association = (function() {
    
    return {
      /**
       * This function is called every time a model is created via ExtMVC.Model.create
       * (*NOT* when a model instance is instantiated). Here we initialize associations
       * on this model.
       */
      initialize: function(model) {
        var proto = model.prototype,
            assoc = ExtMVC.Model.plugin.association;
        
        this.resolveDependencies(model);
        
        if (proto.hasMany) {
          Ext.each(this.parseParams(proto.hasMany, 'HasMany'), function(params) {
            this.define(assoc.HasMany, model, params);
          }, this);
        }
        
        if (proto.belongsTo) {
          Ext.each(this.parseParams(proto.belongsTo, 'BelongsTo'), function(params) {
            this.define(assoc.BelongsTo, model, params);
          }, this);
        }
      },
      
      /**
       * @property dependencies
       * @type ExtMVC.lib.Dependencies
       * Dependencies class to manage associations on currently undefined models
       */
      dependencies: new ExtMVC.lib.Dependencies(),
      
      /**
       * Defines a new association between two models.  If both models have already been created,
       * the association is created immediately, otherwise it is deferred until both models have been created
       * You should never have to call this manually...
       * @param {Function} constructor The Association constructor to use (one of BelongsTo or HasMany)
       * @param {ExtMVC.model.Base} model The model which owns the association
       * @param {Object} params Association params such as associationName and associatedClass
       */
      define: function(constructor, model, params) {
        var modelNS         = ExtMVC.Model.modelNamespace,
            associatedClass = params.associatedClass,
            modelName       = model.prototype.modelName;
        
        if (typeof modelNS[associatedClass] == 'function') {
          //create the model now
          this.create.call(this, constructor, modelName, params);
        } else {
          //create the model later
          params.associationConstructor = constructor;
          this.dependencies.add(associatedClass, modelName, params);
        }
      },
      
      /**
       * Creates an association once both models in question have been created
       * @param {Function} constructor The association constructor (should be HasMany or BelongsTo function)
       * @param {String} modelName The name of the model on which the association is to be defined
       * @param {Object} params Parameters for the association, containing at least the following properties:
       */
      create: function(constructor, modelName, params) {
        var modelNS         = ExtMVC.Model.modelNamespace,
            model           = modelNS[modelName],
            associatedModel = modelNS[params.associatedClass],
            associationName = params.associationName;
        
        model.prototype[associationName] = new constructor(model, associatedModel, params);
      },
      
      /**
       * This is called immediately by initialize().  Associations are often specified on models that haven't
       * been created yet, so we keep a list of dependent associations which are to be defined as soon as the
       * model has been created.  This method is called with the Model constructor function, looks up any associations
       * that couldn't previously be defined (as this model did not yet exist), and creates them no
       * @param {ExtMVC.Model.Base} model The newly created model
       */
      resolveDependencies: function(model) {
        var dependents = this.dependencies.get(model.prototype.modelName);
        
        Ext.each(dependents || [], function(dependent) {
          var constructor = dependent.config.associationConstructor;
          delete dependent.config.associationConstructor;
          
          this.create(constructor, dependent.name, dependent.config);
        }, this);
      },
      
      /**
       * Parses belongsTo and hasMany params into a unified format
       * @param {Mixed} params String, Object or Array
       * @param {String} associationType BelongsTo or HasMany - decides how to generate the default association name
       * @return {Array} An array of normalized params objects
       */
      parseParams: function(params, associationType) {
        var results         = [],
            associationType = associationType || 'BelongsTo',
            inflectMethod   = associationType == 'BelongsTo' ? 'singularize' : 'pluralize';
                
        /**
         * We're either passed a string, an object, or an array containing one or more
         * of each...
         */
        if (Ext.isArray(params)) {
          Ext.each(params, function(association) {
            results.concat(this.parseParams(association));
          }, this);
          return results;
          
        } else {
          if (typeof params == 'string') {
            params = {associatedClass: params};
          }
          
          var assocClass = params.associatedClass,
              assocName  = typeof assocClass == 'function'
                         ? ExtMVC.Inflector[inflectMethod](assocClass.prototype.modelName)
                         : ExtMVC.Inflector[inflectMethod](assocClass);
          
          Ext.applyIf(params, {
            extend:          {},
            associationName: assocName
          });
          
          results.push(params);
        }
        
        return results;
      }
    };
  })();
  
  var A = ExtMVC.Model.plugin.association;
  
  /**
   * @class ExtMVC.Model.plugin.association.Base
   * Association Base class which provides basic functionality for other Association classes to build upon
   * Don't use directly - instead use the HasMany or BelongsTo classes.
   */
  A.Base = function(ownerClass, associatedClass, config) {
    config = config || {};
    
    this.ownerClass = ownerClass;
    this.associatedClass = associatedClass;
    
    Ext.apply(this, config.extend || {});
    this.initialConfig = config;
    
    this.initialize();
  };

  A.Base.prototype = {
    /**
     * Sets up default values for foreignKey
     */
    initialize: Ext.emptyFn
  };
  
  /**
   * @class A.BelongsTo
   * @extends A.Base
   * A belongsTo association
   */
  A.BelongsTo = Ext.extend(A.Base, {
    initialize: function() {
      Ext.apply(this, {
        name:       ExtMVC.Inflector.singularize(this.associatedClass.prototype.tableName),
        foreignKey: this.associatedClass.prototype.foreignKeyName
      });
    }
  });
  
  /**
   * @class A.HasMany
   * @extends A.Base
   * A hasMany association
   */
  A.HasMany = Ext.extend(A.Base, {
    
    /**
     * Set up default values for name etc
     */
    initialize: function() {
      Ext.apply(this, {
        name:       this.associatedClass.prototype.tableName,
        foreignKey: this.ownerClass.prototype.foreignKeyName
      });
    }
  });
})();

ExtMVC.Model.addPlugin(ExtMVC.Model.plugin.association);

/**
 * Method  Collection Individual
 * create  yes        yes  (but different)
 * build   yes        yes
 * find    yes        no
 * loaded  yes        yes  (but different)
 * count   yes        no
 * destroy yes        yes  (but different)
 */

/**
 * Method  HasMany BelongsTo
 * create  yes     no
 * build   yes     no
 * destroy yes     yes
 * find    yes     yes
 */

/**
 * User.find(1, {
 *   success: function(user) {
 *     //on belongs to associations
 *     user.group.destroy();
 *     user.group.find({success: function(group) {}});
 *     user.group.set(someGroupInstance); //someGroupInstance must be a saved record (e.g. have an ID)
 * 
 *     //on has many associations
 *     user.posts.destroy(1);
 *     user.posts.find({id: 1, conditions: [{field: 'title', comparator: '=', value: 'some title'}]}, options);
 *     user.posts.create(data, options)
 *     user.posts.build(data)
 *   }
 * };
 */

// ExtMVC.Model.define('User', {
//   fields:  [],
//   belongsTo: "Group",
//   hasMany: [{
//     name:       'posts',
//     className:  'Post',
//     foreignKey: 'user_id',
//     
//     extend: {
//       //some functions
//     }
//   }]
// });
// 
// user.posts.find(1, {
//   success: function() {},
//   failure: function() {}
// });
// 
// user.posts.create({}, {
//   success: function() {},
//   failure: function() {}
// });
// 
// user.posts.build({});
// 
// user.posts.loaded();
// user.posts.count();
// user.posts.destroy(1);
// 
// ExtMVC.Model.define('Post', {
//   fields:    [],
//   belongsTo: [{
//     name:       'user',
//     className:  'User',
//     foreignKey: 'user_id',
//     
//     extend: {
//       //some functions
//     }
//   }],
//   hasMany: 'Comment'
// });
// 
// post.user.find();
// post.user.loaded();
// post.user.destroy();
// 
// ExtMVC.Model.define('Comment', {
//   fields:    [],
//   belongsTo: "Post"
// });