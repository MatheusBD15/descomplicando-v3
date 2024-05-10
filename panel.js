const getResults = (questions) => {
  // Request a buscar: undergrad/questions/assertions-corrections?assertions
  const splitter = (array, size) => {
    const groups = [];
    for (let i = 0; i < array.length; i += size) {
      groups.push(array.slice(i, i + size));
    }
    return groups;
  };

  const splitedQuestions = splitter(questions, 5);
  const results = {};
  splitedQuestions.forEach((question, index) => {
    let letters = ["A", "B", "C", "D", "E"];
    let answerNumber = 0;
    question.forEach((answer, index) => {
      if (answer.correct) {
        answerNumber = index;
      }
    });
    results[index + 1] = letters[answerNumber];
  });
  return results;
};

chrome.devtools.network.onRequestFinished.addListener((request) => {
  if (
    request.request.url.includes(
      "undergrad/questions/assertions-corrections?assertions"
    )
  ) {
    request.getContent((content, encoding) => {
      if (content) {
        const listParent = document.getElementById("results");
        listParent.innerHTML = "";

        const parsedContent = JSON.parse(content);
        const results = getResults(parsedContent.data);

        for (const result of Object.keys(results)) {
          const li = document.createElement("li");
          li.id = result;
          li.textContent = results[result];
          listParent.appendChild(li);
        }
      }
    });
  }
});
