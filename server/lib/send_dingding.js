const fetch = require("node-fetch");
const { dd } = require("./config");
const { JS_TYPE_LIST } = require('./sourcemap')
const { phoneMap, group_report_url } = dd;


class DDReport {
  templateJS = ({ developer, filepath, type, source, userAgent }) => {
    let content = "";
    content += `### eos报警:\n`;
    content += `> type: ${type}`;
    content += `> developer: ${developer}`;
    content += `> filepath: ${filepath}`;
    content += `> source: ${source}`;
    content += `> userAgent: ${userAgent}`;
    return content;
  };
  templateStatic = ({ userAgent, type, src, input, method, body, stack }) => {
    let content = "";
    content += `### eos报警:\n`;
    content += `> type: ${type}`;
    if (src) {
      content += `> src: ${developer}`;
    } else {
      content += `> url: ${input}`;
      content += `> method: ${method}`;
      content += `> body: ${body}`;
      content += `> stack: ${stack}`;
      content += `> userAgent: ${userAgent}`;
    }
    return content;
  };
  send2developer = (reportObject, developer) => {
    const { type } = reportObject;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "线上错误发生了",
        msgtype: "markdown",
        content: JS_TYPE_LIST.includes(type)
          ? this.templateJS(reportObject)
          : this.templateStatic(reportObject),
        at: {
          atMobiles: [phoneMap[developer]],
          atUserIds: ["user123"],
          isAtAll: developer ? false : true,
        },
      }),
    };
    fetch(
      `https://oapi.dingtalk.com/robot/send?access_token=${group_report_url}`,
      options
    ).catch(console.log);
  };
}

module.exports = new DDReport();
