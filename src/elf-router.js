/**
 * 
 * https://www.elfjs.org
 * 
 * @copyright 2018 Wu Hu. All Rights Reserved.
 * 
 * @version 2.0.0
 * @license MIT
 * 
 */
"use strict";

!(function (exports) {

    function wrong(error) {
        throw error;
    }
    function flatten(value) {
        var result = [];
        var length = value.length;
        for (var i = 0; i < length; i++) {
            var ns = value[i];
            if (Array.isArray(ns)) {
                if (ns.length) {
                    result.push.apply(result, flatten(ns));
                }
            } else {
                if (isValid(ns)) {
                    result.push(ns);
                }
            }
        }
        return result;
    }
    function isValid(value) {
        return value !== null && value !== void 0;
    }
    function pushState(path) {
        if (history.pushState) {
            if (location.pathname !== path) {
                history.pushState(null, null, path);
            }
        }
    }
    function navigate(path) {
        pushState(path);
        var len = routeContainer.length;
        for (var i = 0; i < len; i++) {
            var route = routeContainer[i];
            var match = path.match(route.reg);
            if (match) {
                var props = {};
                var count = route.group.length;
                for (var j = 0; j < count; j++) {
                    props[route.group[j]] = decodeURIComponent(match[j + 1]);
                }
                return exports.Promise.resolve(route.component(props)).then(function (component) {
                    routeStructure = { type: component, props: props };
                });
            }
        }
        return exports.Promise.reject(new Error("No route matching path " + JSON.stringify(path)));
    }
    function register() {
        Array.prototype.push.apply(routeContainer, flatten(Array.prototype.slice.apply(arguments)).map(function (route) {
            var path = route.path;
            var parts = path.split("/");
            var len = parts.length;
            var reg = "";
            var matchedGroup = [];
            var matchedSlash = true;
            for (var i = 0; i < len; i++) {
                var part = parts[i];
                if (part === "" ||
                    part === ".") {
                    continue;
                }
                if (matchedSlash) {
                    reg += "\\/";
                }
                if (part.charAt(0) === ":") {
                    matchedGroup.push(part.slice(1));
                    reg += "([^\\/]+)";
                } else if (part === "**") {
                    matchedSlash = false;
                    reg += ".*";
                } else {
                    reg += part.replace(".", "\\.").replace("*", "[^\\/]*");
                }
            }
            return {
                group: matchedGroup,
                component: route.component,
                reg: new RegExp("^" + reg + "$", "i")
            };
        }));
    }

    var routeContainer = [];
    var routeStructure = null;

    var RouterLink = exports.Component("router-link", {
        render: function () {
            return exports.createElement("a", exports.assign({ ref: "link" }, this.props), this.props.children);
        },
        onInitial: function () {
            exports.attachEvent(this.refs.link, "click", this);
        },
        onDispose: function () {
            exports.detachEvent(this.refs.link, "click", this);
        },
        handleEvent: function (event) {
            pushState(this.props.href);
            navigate(this.props.href);
            event.stopPropagation();
            event.preventDefault();
        }
    });
    var RouterView = exports.Component("router-view", {
        constructor : function () {
            this.handleEvent();
        },
        render: function () {
            return routeStructure && exports.createElement(routeStructure.type, routeStructure.props, routeStructure.children);
        },
        onInitial: function () {
            exports.attachEvent(window, "popstate", this);
        },
        onDispose: function () {
            exports.detachEvent(window, "popstate", this);
        },
        handleEvent: function () {
            navigate(location.pathname);
        }
    });

    exports.router = {
        navigate: navigate,
        register: register,
        RouterLink: RouterLink,
        RouterView: RouterView
    };

    exports.depend(RouterLink, RouterView);
}(
    typeof exports !== "undefined" ? module.exports = require("elfjs") : this.Elf
));