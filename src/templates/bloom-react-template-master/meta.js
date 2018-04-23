module.exports = {
  prompts: [
    {
      type: "string",
      name: "name",
      required: true,
      message: "Project name"
    },
    {
      type: "string",
      name: "description",
      required: true,
      message: "Project description",
      default: "A React.js project"
    },
    {
      type: "string",
      name: "keywords",
      message: "Project keywords",
      default: "react"
    },
    {
      type: "string",
      name: "author",
      message: "Author"
    },
    {
      type: "string",
      name: "license",
      message: "License",
      default: "MIT"
    }
  ]
}
