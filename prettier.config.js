/** @type {import("prettier").Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cn", "twMerge"],
};
