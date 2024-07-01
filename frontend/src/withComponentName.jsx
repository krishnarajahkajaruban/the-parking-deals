import React from 'react';

const withComponentName = (Component, name) => {
    const WrappedComponent = (props) => <Component {...props} />;
    WrappedComponent.componentName = name;
    return WrappedComponent;
};

export default withComponentName;
