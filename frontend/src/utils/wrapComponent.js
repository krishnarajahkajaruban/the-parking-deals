import withComponentName from "../withComponentName";


const wrapComponent = (Component, name) => {
    return withComponentName(Component, name);
};

export default wrapComponent;