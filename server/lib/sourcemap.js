const fs = require("fs");
const path = require("path");
const { SourceMapConsumer } = require("source-map-js");
const runShell = require("./runShell");

const pathReg = /(?<=.*\/dist\/).*/g;
const devpathReg = /(?<=.*8080\/).*/g;
const errorReg = /(?<=.*:)\d+:\d+/g;
const stackPathReg = /(?<=.*\d{4}\/).*(?=:\d+:\d+)/g;

const JS_TYPE_LIST = ["js", "promise"];

const { readFileSync } = fs;

const findPostionMsg = (stack) => {
  const matchPosition = stack.match(errorReg);
  if (Array.isArray(matchPosition) && matchPosition[0]) {
    console.log(matchPosition);
    return matchPosition[0].split(":");
  }
  return null;
};



const originalPositionFor = async (stack, sourceFilePath) => {
  const [lineNo, colNo] = findPostionMsg(stack) || [];
  const RealPath = sourceFilePath
  ? sourceFilePath.match(devpathReg)[0]
  : stack.match(stackPathReg)[0];
  let rawSourceMap = {};
  let mapfilepath;
  try {
    mapfilepath = path.resolve(
      __dirname,
      `../.maps/${RealPath}.map`
    );
    rawSourceMap = readFileSync(mapfilepath, 'utf-8');
    const consumer = new SourceMapConsumer(JSON.parse(rawSourceMap));
    const pos = lineNo
    ? consumer.originalPositionFor({
        line: +lineNo,
        column: +colNo,
      })
    : null;
    return pos;
  } catch (error) {
    console.error(`error:source-map-path: ${RealPath}`);
  }

}
const findDeveloper = (filepath, line) => {
  return runShell(`git blame ${filepath} -L ${line},${line}`).then((res) => {
    console.log(res);
    return res;
  });
};

module.exports = {
  originalPositionFor,
  findDeveloper,
  JS_TYPE_LIST,
};
