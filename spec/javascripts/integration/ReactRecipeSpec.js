var BackboneRecipe = require('../../../public/js/navigator-js/integration/BackboneRecipe');
var ReactTestUtils = require('react-addons-test-utils');
var jQuery = require('jquery');
var React = require('react');

const ReactComponent = React.createClass({
    render: function render() {
        return React.createElement('div')
    }
});

describe('React Recipe', function() {
	var ViewRecipe = navigatorjs.integration.ViewRecipe;
	var viewRecipe;

	beforeEach(function() {
		viewRecipe = new ViewRecipe();
		viewRecipe.toView(ReactComponent);
	});

  it('should have a type', function() {
    expect(typeof BackboneRecipe._type).toBe('string');
  });

	it('should return a jQuery object', function() {
		viewRecipe.initialize();
		expect(viewRecipe.getRootEl() instanceof $).toBe(true);
	});

	it('should call isInstantiated', function() {
		spyOn(viewRecipe, 'isInstantiated').and.callThrough();
		viewRecipe.isMounted();
		expect(viewRecipe.isInstantiated).toHaveBeenCalled();
	});

	it('should return false if not isInstantiated', function() {
		spyOn(viewRecipe, 'isInstantiated').and.returnValue(false);
		expect(viewRecipe.isMounted()).toBe(false);
	});

	it('should return true if and only if view element is in the DOM', function() {
    viewRecipe._viewClass = ReactComponent;
		viewRecipe.initialize();

		expect(viewRecipe.isMounted()).toBe(false);
    ReactTestUtils.renderIntoDocument(viewRecipe._viewInstance);
		expect(viewRecipe.isMounted()).toBe(true);
	});

	it('should create a view instance', function() {
		var MyViewClass = function MyViewClass() {};
		viewRecipe._viewClass = ReactComponent;
		viewRecipe.initialize();

		expect(ReactTestUtils.isElement(viewRecipe._viewInstance)).toBe(true);
	});

  it('should push child if and only not already in children array', function() {
    var childView = {
      isInstantiated: function() {
        return true;
      }
    };

    expect(viewRecipe._children.length).toEqual(0);
    viewRecipe._showChild(childView);
    expect(viewRecipe._children.length).toEqual(1);
    viewRecipe._showChild(childView);
    expect(viewRecipe._children.length).toEqual(1);
  });

  it('should initialize child if and only if not initialized already', function() {
    var isInstantiated = false
    var childView = {
      isInstantiated: function() {
        return isInstantiated;
      },

      initialize: function() {
        return null;
      }
    };

    spyOn(childView, 'initialize');

    isInstantiated = true;
    viewRecipe._showChild(childView);
    expect(childView.initialize).not.toHaveBeenCalled();

    isInstantiated = false;
    viewRecipe._children = [];
    viewRecipe._showChild(childView);
    expect(childView.initialize).toHaveBeenCalled();
  });

  it('should reinitialize the react element on showChild', function() {
    spyOn(viewRecipe, 'initialize');
    viewRecipe._showChild({
      isInstantiated: function() {
        return true;
      }
    });
    expect(viewRecipe.initialize).toHaveBeenCalled();
  });

  it('should remove the child from the children array', function() {
    var child = {};
    viewRecipe._children = [child];
    expect(viewRecipe._children.length).toBe(1);
    viewRecipe._removeChild(child);
    expect(viewRecipe._children.length).toBe(0);
  });

  it('should reinitialize the react element on removeChild', function() {
    spyOn(viewRecipe, 'initialize');
    viewRecipe._removeChild();
    expect(viewRecipe.initialize).toHaveBeenCalled();
  });
});