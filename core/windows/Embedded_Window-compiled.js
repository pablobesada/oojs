var WindowDescription = {
    name: 'Embedded_Window',
    inherits: null
};

var Embedded_Window = Object.create({
    '__super__': null,
    '__description__': WindowDescription,
    '__filename__': __filename
});

Embedded_Window.new = function () {
    return Object.create(this).init();
};

Embedded_Window.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this);
    childclass.__description__ = { fields: {} };
    childclass.__description__.name = descriptor.name;
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    return childclass;
};

Embedded_Window.init = function init() {
    return this;
};

//# sourceMappingURL=Embedded_Window-compiled.js.map