/**
 * Tests the validations framework and the built-in validations
 * 
 * var v = new ValidatedModel();
 * v.isValid(); //false
 * v.errors.all; // {title: ['must be present', 'is too short'], text: ['must be present']}
 * v.errors.forField('title'); // ['must be present', 'is too short']
 * v.errors.forField('title', true); // 'must be present and is too short'
 * v.errors.forForm(); //{'title': 'must be present and is too short', 'text': 'must be present'}
 */
Screw.Unit(function() {
  //keep track of the object to which models are currently assigned
  var ns = ExtMVC.Model.modelNamespace;
  
  //define a new model with some validations
  ExtMVC.Model.define("ValidatedModel", {
    fields: [
      {name: 'title', type: 'string'},
      {name: 'text',  type: 'string'}
    ],
    
    validatesPresenceOf: ['title', 'text'],
    validatesLengthOf:   [{field: 'title', min: 5, max: 10}]
  });
  
  describe("Individual Validations", function() {
    ExtMVC.Model.define('SomeModel', {
      fields: [
        {name: 'title', type: 'string'},
        {name: 'text',  type: 'string'},
        {name: 'price', type: 'number'}
      ]
    });
    
    var myInstance = new ns.SomeModel({});
    var V = ExtMVC.Model.validation;
    
    describe("Validates Presence Of", function() {
      var v = new V.ValidatesPresenceOf(myInstance, 'title');
      
      it("should not be valid if not present", function() {
        expect(v.isValid()).to(equal, false);
      });
      
      it("should not be valid if an empty string", function() {
        myInstance.set('title', '');
        expect(v.isValid()).to(equal, false);
      });
      
      it("should be valid if any value is present", function() {
        myInstance.set('title', 'My Title');
        expect(v.isValid()).to(equal, true);
        
        myInstance.set('title', {'some': 'object'});
        expect(v.isValid()).to(equal, true);
      });
      
      it("should return a default message", function() {
        expect(v.message).to(equal, 'must be present');
      });
      
      it("should allow specification of a customised message", function() {
        var v = new V.ValidatesPresenceOf(myInstance, 'title', {message: 'My Message'});
        expect(v.message).to(equal, 'My Message');
      });
    });

    describe("Validates Numericality Of", function() {
      var v = new V.ValidatesNumericalityOf(myInstance, 'price');
      
      it("should pass if the field is a number", function() {
        myInstance.set('price', 9.99);
        expect(v.isValid()).to(equal, true);
      });
      
      it("should fail if the field is not a number", function() {
        myInstance.set('price', 'not a number!');
        expect(v.isValid()).to(equal, false);
        
        expect(v.message).to(equal, 'must be a number');
      });
    });

    describe("Validates Length Of", function() {
      var v = new V.ValidatesLengthOf(myInstance, 'title', {minimum: 5, maximum: 9});
      
      it("should fail if the field is too short", function() {
        myInstance.set('title', 'a');
        expect(v.isValid()).to(equal, false);
        expect(v.message).to(equal, 'is too short');
      });
      
      it("should fail if the field is too long", function() {
        myInstance.set('title', 'a very long title');
        expect(v.isValid()).to(equal, false);
        expect(v.message).to(equal, 'is too long');
      });
      
      it("should pass if the field is an acceptable length", function() {
        //minimum
        myInstance.set('title', 'Adama');
        expect(v.isValid()).to(equal, true);
        
        //maximum
        myInstance.set('title', 'President');
        expect(v.isValid()).to(equal, true);
        
        //in between
        myInstance.set('title', 'Colonel');
        expect(v.isValid()).to(equal, true);
      });
    });
    
    describe("Validates Inclusion Of", function() {
      var v = new V.ValidatesInclusionOf(myInstance, 'title', {allowed: ['test', 'title', 'another title']});
      
      it("should pass if the field is one of the allowed values", function() {
        Ext.each(['test', 'title', 'another title'], function(allowedTitle) {
          myInstance.set('title', allowedTitle);
          expect(v.isValid()).to(equal, true);
        }, this);
      });
      
      it("should fail if the field is not one of the allowed values", function() {
        myInstance.set('title', 'not an allowed title ');
        expect(v.isValid()).to(equal, false);
      });
      
      it("should generate a meaningful message", function() {
        expect(v.message).to(equal, 'must be one of test, title or another title');
      });
      
      it("should allow setting of a custom message", function() {
        var v = new V.ValidatesInclusionOf(myInstance, 'title', {allowed: [], message: 'My Message'});
        expect(v.message).to(equal, 'My Message');
      });
    });
    
    describe("Validates Exclusion Of", function() {
      var v = new V.ValidatesExclusionOf(myInstance, 'title', {disallowed: ['test', 'title', 'another title']});
      
      it("should pass if the field is not one of the disallowed values", function() {
        myInstance.set('title', 'This is allowed');
        expect(v.isValid()).to(equal, true);
      });
      
      it("should fail if the field is one of the disallowed values", function() {
        Ext.each(['test', 'title', 'another title'], function(disallowedTitle) {
          myInstance.set('title', disallowedTitle);
          expect(v.isValid()).to(equal, false);
        }, this);
      });
      
      it("should generate a meaningful message", function() {
        expect(v.message).to(equal, 'must not be test, title or another title');
      });
      
      it("should allow setting of a custom message", function() {
        var v = new V.ValidatesExclusionOf(myInstance, 'title', {disallowed: [], message: 'My Message'});
        expect(v.message).to(equal, 'My Message');
      });
    });
    
    describe("Validates Format Of", function() {
      var v = new V.ValidatesFormatOf(myInstance, 'title', {regex: /[A-Za-z]*\. [A-Za-z]/});
      
      it("should pass if the regex matches", function() {
        myInstance.set('title', 'Mr. Bean');
        
        expect(v.isValid()).to(equal, true);
      });
      
      it("should fail if the regex does not match", function() {
        myInstance.set('title', 'Ed');
        
        expect(v.isValid()).to(equal, false);
      });
      
      it("should supply a default message", function() {
        expect(v.message).to(equal, 'is invalid');
      });
    });
  });
  
  describe("A Validation Errors object", function() {
    var myModel = new ns.ValidatedModel();
    // var errors = new ExtMVC.Model.validation.Errors(myModel);
  });
  
  describe("Model Validations", function() {
    // describe("A Validation Errors object", function() {
    //   var myModel = new ns.ValidatedModel({});
    //   var errors  = new ExtMVC.Model.ValidationErrors(myModel);
    //   
    //   it("should have a errors property", function() {
    //     expect(typeof errors.errors).to_not(equal, "undefined");
    //   });
    //   
    //   it("should return true for isValid() if there are no errors", function() {
    //     
    //   });
    //   
    //   it("should join errors into a readable form", function() {
    //     
    //   });
    // });
  });
});
