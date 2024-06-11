define("classes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.global_var = void 0;
    class global_var {
        constructor(parameters) {
            console.log("constructed global_vars with:", parameters);
        }
    }
    exports.global_var = global_var;
});
define("main", ["require", "exports", "classes"], function (require, exports, classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const message = 'TypeScript';
    console.log(message);
    new classes_1.global_var(2);
});
