document.addEventListener('DOMContentLoaded', function() {
  // Generate trials
  let trials = [];
  for (let i = 0; i < 2000; i++) {
    let price = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;
    let rating = Math.floor(Math.random() * 5) + 1;

    let trial = {
      type: 'survey-multi-choice',
      questions: [
        {prompt: `The product costs $${price}. Is it expensive?`, options: ['Yes', 'No', 'Don’t know'], required: true},
        {prompt: `The product has a rating of ${rating}. Is it high-rated?`, options: ['Yes', 'No', 'Don’t know'], required: true},
        {prompt: 'Considering its price and rating, is it a good purchase?', options: ['Yes', 'No', 'Don’t know'], required: true}
      ],
      preamble: `<img src="icon_path_here.png" alt="Product Icon">`
    };

    trials.push(trial);
  }

  jsPsych.init({
    timeline: trials,
    on_finish: function() {
      // This will output the data as a CSV string
      let csv = jsPsych.data.get().csv();

      // You can then download it manually or send it to a server
      downloadCSV(csv, 'experiment_data.csv');
    }
  });

  function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], {type: "text/csv"});

    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
});
