//Crée une grille vide
function createEmptyGrid() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

//Vérifie si un nombre est valide dans une case
function isValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }
  return true;
}

//Résout la grille avec backtracking
function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) return true;

            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

//Génère un Sudoku avec des cases vides
function generateSudoku(emptyCells = 30) {
  const grid = createEmptyGrid();

  //Remplir quelques cases aléatoires
  for (let i = 0; i < 17; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    const num = Math.floor(Math.random() * 9) + 1;

    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
    }
  }

  // Résoudre la grille complète
  solveSudoku(grid);

  // Vider des cases pour créer le puzzle
  for (let i = 0; i < emptyCells; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (grid[row][col] === 0);

    grid[row][col] = 0;
  }

  return grid;
}

// Affiche le grille dans le navigateur
function displaySudoku(grid) {
  const container = document.getElementById("sudoku");
  container.innerHTML = "";

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";
      if (cell === 0) {
        cellDiv.classList.add("empty");
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.dataset.row = rowIndex;
        input.dataset.col = colIndex;
        cellDiv.appendChild(input);
      } else {
        cellDiv.textContent = cell;
      }
      container.appendChild(cellDiv);
    });
  });
}

// Affiche les solutions temporairement(0.1secondes)
function showSolutionTemporarily(solution, originalGrid) {
  // Afficher la solution
  displaySudoku(solution);

  //Masquer après 1secondes
  setTimeout(() => {
    displaySudoku(originalGrid); //Restaurer la grille originale
  }, 1000);
}

//Vérifie si la solution saisie correspond à la solution correcte
function validateSudoku(grid, solution) {
  const inputs = document.querySelectorAll(".cell.empty input");
  for (const input of inputs) {
    const row = parseInt(input.dataset.row, 10);
    const col = parseInt(input.dataset.col, 10);
    const value = parseInt(input.value, 10);

    // Vérifier si la case est vide ou non numérique
    if (isNaN(value) || value < 1 || value > 9) {
      return false; // echec si une valeur est invalide
    }

    if (value !== solution[row][col]) {
      return false; // echec si la solution ne correspond pas
    }
  }
  return true; // Toutes les valeurs sont correctes
}

//Affiche un message à l'utilisateur
function displayMessage(message, isSuccess) {
  const messageContainer = document.querySelector(".message");

  //Ajouter le texte et le style
  messageContainer.textContent = message;
  messageContainer.className = `message ${isSuccess ? "success" : "error"}`;
  messageContainer.style.display = "block"; // Afficher le message

// Masquer le message après 5 secondes 
setTimeout (() => {
  messageContainer.style.display = "none";
}, 5000);
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  const grid = generateSudoku(30); //Génère une grille avec 30 cases vides
  const originalGrid = JSON.parse(JSON.stringify(grid));
  const solution = JSON.parse(JSON.stringify(grid)); // Sauvegarde de la solution
  solveSudoku(solution); // Résoudre pour obtenir la solution correcte 
  displaySudoku(grid); // Affiche la grille sudoku dans la page

  // Résoudre automatiquement la grille

  document.getElementById("solve-button").addEventListener("click", () => {
    solveSudoku(grid);
    showSolutionTemporarily(grid, originalGrid); // Affiche temporairement la solution
  });

  // Valider la solution de l'utilisateur

  document.getElementById("validate-button").addEventListener("click", () => {
    if(validateSudoku(grid, solution)) {
      displayMessage("Bravo, vous avez réussi!", true);
      setTimeout(() => {
        location.reload(); // Réinitialise le jeu après 5 secondes
      }, 5000);
    } else {
      displayMessage("Erreur: vérifiez votre solution.", false);
    }
  });
});

// Pour le tutoriel
document.addEventListener("DOMContentLoaded", () => {
  const tutorialModal = 
  document.getElementById("tutorial-modal");
  const closeTutorialButton = 
  document.getElementById("close-tutorial");
  const showTutorialButton = 
  document.getElementById("show-tutorial");

  // Afficher le modal lorsque l'utilisateur clique sur "Tutoriel"
  showTutorialButton.addEventListener("click", () => {
    tutorialModal.style.display = "block";
  }); 

  // Fermer le modal lorsque l'utilisateur clique sur "OK"
  closeTutorialButton.addEventListener("click", () => {
    tutorialModal.style.display = "none";
  });

  // Fermer le modal lorsque l'utilisateur clique en dehors de celui-ci
  window.addEventListener("click", (event) => {
    if (event.target === tutorialModal)
    {
      tutorialModal.style.display = "none";
    }
  });
});