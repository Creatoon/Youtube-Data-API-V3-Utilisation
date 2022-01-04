const fs = require("fs");
const chalk = require("chalk");

class Utils {
  _add = () => {
    if (process.argv[4] === undefined)
      return console.log(
        chalk.red("Error: Missing tasks string. Nothing added!")
      );

    const task = process.argv[4] + " " + `[${process.argv[3]}]`;

    fs.appendFileSync("./task.txt", `${task}\n`, "utf-8");
    console.log(
      `${chalk.bgGrey("Added task:")} "${chalk.hex("#00b894")(
        task.split(" [")[0]
      )}" ${chalk.hex("#00b894")("with priority")} ${chalk.hex("#00b894")(
        task.split(" [")[1].split("]")[0]
      )}`
    );
  };

  _ls = () => {
    try {
      const task = fs.readFileSync("./task.txt", "utf-8").split("\n");

      if (task.join("").length === 0)
        return console.log(chalk.red("There are no pending tasks!"));

      task.forEach((el, i) => {
        if (el !== "") console.log(chalk.hex("#FFA500")(`${i + 1}. ${el}`));
      });
    } catch (err) {
      console.log(chalk.red("There are no pending tasks!"));
    }
  };

  _del = () => {
    try {
      const task = fs.readFileSync("./task.txt", "utf-8").split("\n");
      if (process.argv[3] === undefined)
        return console.log(
          chalk.red(`Error: Missing NUMBER for deleting tasks.`)
        );

      if (
        parseInt(process.argv[3]) >= task.length ||
        parseInt(process.argv[3]) === 0
      )
        return console.log(
          chalk.red(
            `Error: task with index #${process.argv[3]} does not exist. Nothing deleted.`
          )
        );

      if (task.length > parseInt(process.argv[3])) {
        fs.unlink(`${__dirname}/task.txt`, () => null);
        task.forEach((el) => {
          if (!(el.trim().length === 0) && el !== task[process.argv[3] - 1])
            fs.appendFileSync("./task.txt", `${el}\n`, "utf-8");
        });

        console.log(
          chalk.bgGray("Deleted task") +
            " " +
            chalk.hex("#00b894")(`#${process.argv[3]}`)
        );
      }
    } catch (err) {
      if (
        err.message ===
          "ENOENT: no such file or directory, open './task.txt'" &&
        process.argv[3] === undefined
      )
        return console.log(
          chalk.red(`Error: Missing NUMBER for deleting tasks.`)
        );

      console.log(
        chalk.red(
          `Error: task with index #${process.argv[3]} does not exist. Nothing deleted.`
        )
      );
    }
  };

  _done = () => {
    try {
      if (process.argv[3]) {
        const task = fs.readFileSync("./task.txt", "utf-8").split("\n");

        if (process.argv[3] * 1 === 0 || task.length < process.argv[3] * 1)
          return console.log(
            chalk.red(
              `Error: no incomplete item with index #${process.argv[3]} exists.`
            )
          );

        if (task.join("").length > 0) {
          fs.appendFileSync(
            "./completed.txt",
            `${task[process.argv[3] - 1]}\n`,
            "utf-8"
          );

          const completed = fs
            .readFileSync("./completed.txt", "utf-8")
            .split("\n");

          fs.unlink(`${__dirname}/task.txt`, () => null);

          task.forEach((el) => {
            if (!completed.includes(el))
              fs.appendFileSync("./task.txt", `${el}\n`, "utf-8");
          });

          console.log(chalk.hex("#00b894")("Marked item as done."));
        }
      } else {
        console.log(
          chalk.red("Error: Missing NUMBER for marking tasks as done.")
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  _report = () => {
    const task = fs.readFileSync("./task.txt", "utf-8").split("\n");
    const completed = fs.readFileSync("./completed.txt", "utf-8").split("\n");

    console.table(
      `${chalk.bgGrey("Pending")} ${chalk.hex("#FFA500")(
        `: ${task.length - 1}`
      )}`
    );
    task.forEach((el, i) => {
      if (el !== "") console.log(chalk.hex("#00b894")(`${i + 1}. ${el}`));
    });

    console.table(
      `${chalk.bgGrey("Completed")} ${chalk.hex("#FFA500")(
        `: ${completed.length - 1}`
      )}`
    );
    completed.forEach((el, i) => {
      let ele = el.split(" [")[0];
      if (el.trim().length > 0)
        console.log(chalk.hex("#00b894")(`${i + 1}. ${ele}`));
    });
  };
}

const _help = () => {
  const helpText = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

  console.log(
    `${chalk.bgGrey(helpText.split("\n")[0])}${chalk.hex("#FFA500")(
      helpText.split("-")[1]
    )}`
  );
};

(function () {
  const utils = new Utils();

  switch (process.argv[2]) {
    case "help":
      _help();
      break;
    case "add":
      utils._add();
      break;
    case "ls":
      utils._ls();
      break;
    case "del":
      utils._del();
      break;
    case "done":
      utils._done();
      break;
    case "report":
      utils._report();
      break;
    default:
      _help();
  }
})();
