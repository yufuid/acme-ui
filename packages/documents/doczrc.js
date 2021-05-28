export default {
  base: "/acme-ui",
  /**
   * 规定哪些文件会被当做文档文件，string | string[]
   */
  files: "**/*.{md,markdown,mdx}",
  /**
   * 排除哪些文件
   */
  ignore: ["README.md", "../core/node_modules", "../icons/node_modules"],
  /**
   * 网站的标题，默认是 package.json name
   */
  title: "Acme UI",
  /**
   * 网站的描述，会生成 mate 标签，默认是 package.json description
   */
  description: "Next Gen UI Design Language and Library",
  /**
   * Typescript 项目开启，同时需要创建 tsconfig.json 文件
   */
  typescript: true,
  /**
   * 用来配置静态文件绝对路径，例如 ![placeholder image](/public/some-image.png)
   * NOTICE：亲测，无效，还是得用相对路径
   */
  public: "/public",
  /**
   * 默认的 Docz 文档中提供编辑跳转到 github 的功能，这个用来配置调转过去的分支名
   */
  editBranch: "main",
  /**
   * docz dev 环境的端口号配置，同样可配置 host
   */
  port: 3000,
  docgenConfig: {
    searchPatterns: ["../core/**/*", "../icons/**/*"],
  },
  filterComponents: (files) =>
    files.filter((filepath) => /\/[A-Z]\w*\.(js|jsx|ts|tsx)$/.test(filepath)),
};
