// Select elements

const form = document.querySelector("form");
const tableBody = document.querySelector("tbody");
const totalCount = document.getElementById("total");
const topicStats = document.getElementById("topicStats");
const difficultyStats = document.getElementById("difficultyStats");

const topicFilter = document.getElementById("topicFilter");
const difficultyFilter = document.getElementById("difficultyFilter");

// Load problems
let problems = JSON.parse(localStorage.getItem("problems")) || [];

// Initial render
displayProblems();

// Form submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = form.elements;

    const problem = {
        name: inputs[0].value,
        platform: inputs[1].value,
        topic: inputs[2].value,
        difficulty: inputs[3].value
    };

    problems.push(problem);
    saveAndRender();
    form.reset();
});

// Filter change
topicFilter.addEventListener("change", displayProblems);
difficultyFilter.addEventListener("change", displayProblems);

// Save + refresh
function saveAndRender() {
    localStorage.setItem("problems", JSON.stringify(problems));
    displayProblems();
}

// Display problems + stats
function displayProblems() {
    tableBody.innerHTML = "";
    topicStats.innerHTML = "";
    difficultyStats.innerHTML = "";

    const selectedTopic = topicFilter.value;
    const selectedDifficulty = difficultyFilter.value;

    let filtered = problems.filter((p) => {
        return (
            (selectedTopic === "" || p.topic === selectedTopic) &&
            (selectedDifficulty === "" || p.difficulty === selectedDifficulty)
        );
    });

    let topicCount = {};
    let difficultyCount = {};

    filtered.forEach((p, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.platform}</td>
            <td>${p.topic}</td>
            <td>${p.difficulty}</td>
            <td>
                <button class="delete-btn" onclick="deleteProblem(${index})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);

        topicCount[p.topic] = (topicCount[p.topic] || 0) + 1;
        difficultyCount[p.difficulty] =
            (difficultyCount[p.difficulty] || 0) + 1;
    });

    totalCount.textContent = `Total Problems Solved: ${filtered.length}`;

    for (let t in topicCount) {
        const li = document.createElement("li");
        li.textContent = `${t}: ${topicCount[t]}`;
        topicStats.appendChild(li);
    }

    for (let d in difficultyCount) {
        const li = document.createElement("li");
        li.textContent = `${d}: ${difficultyCount[d]}`;
        difficultyStats.appendChild(li);
    }
}

// Delete problem
function deleteProblem(index) {
    problems.splice(index, 1);
    saveAndRender();
}
