var React = require('react');
var ReactDOM = require('react-dom');

var ReactRecipe = {
  _type: 'REACT',

  // Returns a fake proxy element due to the fact that
  // we do not use these transition functions within
  // our react components

  getViewInstance: function getViewInstance() {
    return this._refProxy;
  },

  // Save reference to our react element instead of
  // view instance like backbone recipe does

  initialize: function initialize() {
    var params = this._viewArguments;

    this._refProxy = {
      navigatorBehaviors: this._viewClass.navigatorBehaviors,
      transitionIn: function transitionIn(cb) {
        if (this.isMounted()) {
          this._ref.transitionIn(cb)
        } else {
          this._queuedCallback = cb;
        }
      }.bind(this),

      transitionOut: function transitionOut(cb) {
        this._ref.transitionOut(cb);
      }.bind(this)
    };

    var props = _.extend(
      {
        ref: function(c) {
          this._ref = c;

          if (this._queuedCallback) {
            this._ref.transitionIn(this._queuedCallback);
            this._queuedCallback = null;
          }
        }.bind(this)
      },
      params[0]
    )

    this._viewInstance = React.createElement(
      this._viewClass,
      props,
      this._children.map(
        function(child) {
          return child._viewInstance;
        }
      )
    );
  },

  // Use ReactDOM's findDOMNode method to find associated
  // DOM node of the component reference

  getRootEl: function getRootEl() {
    return $(ReactDOM.findDOMNode(this._ref));
  },

  // Component is mounted if is not 'null'

  isMounted: function() {
    if (!this.isInstantiated()) {
      this.initialize();
    }

    return !!this._ref;
  },

  // This method only exists on React recipes.  Adds a
  // recipe to a list of children who will be rendered
  // in this element's props.children

  _showChild: function(child) {
    if (this._children.indexOf(child) !== -1) {
      return;
    }
    this._children.push(child);

    if (!child.isInstantiated()) {
      child.initialize();
    }
    this.initialize();
  },

  // Removes a child from this elements props.children
  // and recreates element

  _removeChild: function(child) {
    var childIndex = this._children.indexOf(child);
    if (childIndex !== -1) {
      this._children.splice(childIndex, 1);
    }
    this.initialize();
  }
};

module.exports = ReactRecipe;