import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "./@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.pnpm/lucide-react@0.575.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var mergeClasses = (...classes) =>
  classes
    .filter((className, index, array) => {
      return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    })
    .join(" ")
    .trim();
//#endregion
//#region node_modules/.pnpm/lucide-react@0.575.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.js
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/.pnpm/lucide-react@0.575.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.js
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var toCamelCase = (string) =>
  string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) =>
    p2 ? p2.toUpperCase() : p1.toLowerCase(),
  );
//#endregion
//#region node_modules/.pnpm/lucide-react@0.575.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.js
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
//#endregion
//#region node_modules/.pnpm/lucide-react@0.575.0_react@19.2.7/node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
//#endregion
//#region node_modules/.pnpm/lucide-react@0.575.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.js
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var hasA11yProp = (props) => {
  for (const prop in props)
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
  return false;
};
//#endregion
//#region node_modules/.pnpm/lucide-react@0.575.0_react@19.2.7/node_modules/lucide-react/dist/esm/Icon.js
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Icon = (0, import_react.forwardRef)(
  (
    {
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    },
    ref,
  ) =>
    (0, import_react.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...(!children && !hasA11yProp(rest) && { "aria-hidden": "true" }),
        ...rest,
      },
      [
        ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
        ...(Array.isArray(children) ? children : [children]),
      ],
    ),
);
//#endregion
//#region node_modules/.pnpm/lucide-react@0.575.0_react@19.2.7/node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var createLucideIcon = (iconName, iconNode) => {
  const Component = (0, import_react.forwardRef)(({ className, ...props }, ref) =>
    (0, import_react.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className,
      ),
      ...props,
    }),
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var ArrowLeft = createLucideIcon("arrow-left", [
  [
    "path",
    {
      d: "m12 19-7-7 7-7",
      key: "1l729n",
    },
  ],
  [
    "path",
    {
      d: "M19 12H5",
      key: "x3x0zl",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var ArrowRight = createLucideIcon("arrow-right", [
  [
    "path",
    {
      d: "M5 12h14",
      key: "1ays0h",
    },
  ],
  [
    "path",
    {
      d: "m12 5 7 7-7 7",
      key: "xquz4c",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var CircleCheck = createLucideIcon("circle-check", [
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "10",
      key: "1mglay",
    },
  ],
  [
    "path",
    {
      d: "m9 12 2 2 4-4",
      key: "dzmm74",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Cpu = createLucideIcon("cpu", [
  [
    "path",
    {
      d: "M12 20v2",
      key: "1lh1kg",
    },
  ],
  [
    "path",
    {
      d: "M12 2v2",
      key: "tus03m",
    },
  ],
  [
    "path",
    {
      d: "M17 20v2",
      key: "1rnc9c",
    },
  ],
  [
    "path",
    {
      d: "M17 2v2",
      key: "11trls",
    },
  ],
  [
    "path",
    {
      d: "M2 12h2",
      key: "1t8f8n",
    },
  ],
  [
    "path",
    {
      d: "M2 17h2",
      key: "7oei6x",
    },
  ],
  [
    "path",
    {
      d: "M2 7h2",
      key: "asdhe0",
    },
  ],
  [
    "path",
    {
      d: "M20 12h2",
      key: "1q8mjw",
    },
  ],
  [
    "path",
    {
      d: "M20 17h2",
      key: "1fpfkl",
    },
  ],
  [
    "path",
    {
      d: "M20 7h2",
      key: "1o8tra",
    },
  ],
  [
    "path",
    {
      d: "M7 20v2",
      key: "4gnj0m",
    },
  ],
  [
    "path",
    {
      d: "M7 2v2",
      key: "1i4yhu",
    },
  ],
  [
    "rect",
    {
      x: "4",
      y: "4",
      width: "16",
      height: "16",
      rx: "2",
      key: "1vbyd7",
    },
  ],
  [
    "rect",
    {
      x: "8",
      y: "8",
      width: "8",
      height: "8",
      rx: "1",
      key: "z9xiuo",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var FileCode = createLucideIcon("file-code", [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6",
    },
  ],
  [
    "path",
    {
      d: "M14 2v5a1 1 0 0 0 1 1h5",
      key: "wfsgrz",
    },
  ],
  [
    "path",
    {
      d: "M10 12.5 8 15l2 2.5",
      key: "1tg20x",
    },
  ],
  [
    "path",
    {
      d: "m14 12.5 2 2.5-2 2.5",
      key: "yinavb",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Moon = createLucideIcon("moon", [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var ShieldCheck = createLucideIcon("shield-check", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y",
    },
  ],
  [
    "path",
    {
      d: "m9 12 2 2 4-4",
      key: "dzmm74",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Sun = createLucideIcon("sun", [
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "4",
      key: "4exip2",
    },
  ],
  [
    "path",
    {
      d: "M12 2v2",
      key: "tus03m",
    },
  ],
  [
    "path",
    {
      d: "M12 20v2",
      key: "1lh1kg",
    },
  ],
  [
    "path",
    {
      d: "m4.93 4.93 1.41 1.41",
      key: "149t6j",
    },
  ],
  [
    "path",
    {
      d: "m17.66 17.66 1.41 1.41",
      key: "ptbguv",
    },
  ],
  [
    "path",
    {
      d: "M2 12h2",
      key: "1t8f8n",
    },
  ],
  [
    "path",
    {
      d: "M20 12h2",
      key: "1q8mjw",
    },
  ],
  [
    "path",
    {
      d: "m6.34 17.66-1.41 1.41",
      key: "1m8zz5",
    },
  ],
  [
    "path",
    {
      d: "m19.07 4.93-1.41 1.41",
      key: "1shlcs",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var TriangleAlert = createLucideIcon("triangle-alert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq",
    },
  ],
  [
    "path",
    {
      d: "M12 9v4",
      key: "juzpu7",
    },
  ],
  [
    "path",
    {
      d: "M12 17h.01",
      key: "p32p05",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Upload = createLucideIcon("upload", [
  [
    "path",
    {
      d: "M12 3v12",
      key: "1x0j5s",
    },
  ],
  [
    "path",
    {
      d: "m17 8-5-5-5 5",
      key: "7q97r8",
    },
  ],
  [
    "path",
    {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
      key: "ih7n3h",
    },
  ],
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Zap = createLucideIcon("zap", [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db",
    },
  ],
]);
//#endregion
export {
  ShieldCheck as a,
  Cpu as c,
  ArrowLeft as d,
  Sun as i,
  CircleCheck as l,
  Upload as n,
  Moon as o,
  TriangleAlert as r,
  FileCode as s,
  Zap as t,
  ArrowRight as u,
};
