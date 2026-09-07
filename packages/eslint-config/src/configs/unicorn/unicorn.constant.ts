export const FRAMEWORK_NAME_ALLOW_LIST = {
  generateStaticParams: true,
  Props: true,
  req: true,
  res: true,
};

export const REACT_NAME_REPLACEMENTS = {
  param: false,
  params: false,
  prev: false,
  prop: false,
  props: false,
  ref: false,
  refs: false,
};

export const UNICORN_STRING_CONTENT_PATTERNS = {
  "\\p{Extended_Pictographic}": {
    fix: false,
    message: "Emojis and pictographic symbols are prohibited.",
    suggest: "",
  },
};
