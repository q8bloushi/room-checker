document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const customizeButton = document.getElementById('customizeButton');
    const customizationModal = document.getElementById('customizationModal');
    const closeButton = document.querySelector('.close-button');
    const saveCustomizationButton = document.getElementById('saveCustomizationButton');
    const addLevelButton = document.getElementById('addLevelButton');
    const levelsDiv = document.getElementById('levels');
    const roomsDiv = document.getElementById('rooms');
    const levelContentDiv = document.getElementById('levelContent');
    const levelButtonsContainer = document.getElementById('levelButtonsContainer');
    const levelButtons = document.querySelectorAll('.levelButton');
    const backButton = document.getElementById('backButton');
    const backToLevelsButton = document.getElementById('backToLevelsButton');
    const roomsContainer = document.getElementById('roomsContainer');
    const resetLevelsButton = document.getElementById('resetLevelsButton');
    const resetRoomsButton = document.getElementById('resetRoomsButton');
    const resetRoomButton = document.getElementById('resetRoomButton');

    const saveCodeContainer = document.getElementById('saveCodeContainer');
	
	//const levelsPage = document.getElementById('levels');
	//const startPage = document.getElementById('startPage');
	const backToStartButton = document.getElementById('backToStartButton');

    // Manual Code Transfer Elements
    const generateSaveCodeButton = document.getElementById('generateSaveCodeButton');
    const saveCodeOutput = document.getElementById('saveCodeOutput');
    const copySaveCodeButton = document.getElementById('copySaveCodeButton');
    const saveCodeInput = document.getElementById('saveCodeInput');
    const loadSaveCodeButton = document.getElementById('loadSaveCodeButton');

    let levelRooms = JSON.parse(localStorage.getItem('levelRooms')) || {
        1: [5, 5],
        2: [21, 21, 16, 5],
        3: []
    };

    function saveLevelRooms() {
        localStorage.setItem('levelRooms', JSON.stringify(levelRooms));
    }
	
	// Adding event listener to "Back to Start" button
	backToStartButton.addEventListener('click', () => {
		//levelsPage.style.display = 'none';
		//startPage.style.display = 'block';
	
	    startButton.style.display = '';
        customizeButton.style.display = '';
        levelsDiv.style.display = 'none';
        saveCodeContainer.style.display = 'block';  // show save code elements
	});

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        customizeButton.style.display = 'none';
        levelsDiv.style.display = 'block';
        saveCodeContainer.style.display = 'none';  // Hide save code elements
    });

    customizeButton.addEventListener('click', () => {
        customizationModal.style.display = 'block';
        loadCustomizationOptions();
        saveCodeContainer.style.display = 'block';  // Show save code elements
    });
	
	saveCodeContainer.style.display = 'block'; 

    closeButton.addEventListener('click', () => {
        customizationModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === customizationModal) {
            customizationModal.style.display = 'none';
        }
    });

    saveCustomizationButton.addEventListener('click', () => {
        saveCustomization();
        saveLevelRooms();
        customizationModal.style.display = 'none';
    });

    addLevelButton.addEventListener('click', () => {
        const newLevelNumber = Object.keys(levelRooms).length + 1;
        levelRooms[newLevelNumber] = [];
        saveLevelRooms();
        loadCustomizationOptions();
    });

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.getAttribute('data-level');
            showRooms(level);
        });
    });

    backToLevelsButton.addEventListener('click', () => {
        roomsDiv.style.display = 'none';
        levelsDiv.style.display = 'block';
    });

    backButton.addEventListener('click', () => {
        levelContentDiv.style.display = 'none';
        roomsDiv.style.display = 'block';
    });

    resetLevelsButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
            resetLevels();
            saveLevelRooms();
        }
    });

    resetRoomsButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
            resetRooms();
            saveLevelRooms();
        }
    });

    resetRoomButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
            resetRoom();
            saveLevelRooms();
        }
    });

    function showRooms(level) {
        roomsContainer.innerHTML = '';
        levelRooms[level].forEach((numButtons, index) => {
            const roomButton = document.createElement('button');
            roomButton.classList.add('roomButton', 'green');
            roomButton.textContent = `Room ${index + 1}`;
            roomButton.dataset.level = level;
            roomButton.dataset.room = index + 1;
            const savedRoomColor = localStorage.getItem(`level-${level}-room-${index + 1}-color`);
            if (savedRoomColor) {
                roomButton.classList.remove('green', 'red');
                roomButton.classList.add(savedRoomColor);
            }
            roomButton.addEventListener('click', () => {
                showRoom(level, index + 1, numButtons);
            });
            roomsContainer.appendChild(roomButton);
        });
        levelsDiv.style.display = 'none';
        roomsDiv.style.display = 'block';
    }

    function showRoom(level, room, numButtons) {
        levelButtonsContainer.innerHTML = '';
        levelButtonsContainer.dataset.level = level;
        levelButtonsContainer.dataset.room = room;
        for (let i = 1; i <= numButtons; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            const buttonState = localStorage.getItem(`level-${level}-room-${room}-button-${i}`);
            if (buttonState === 'red') {
                button.classList.add('red');
            } else {
                button.classList.add('green');
            }
            button.addEventListener('click', () => {
                button.classList.toggle('red');
                button.classList.toggle('green');
                localStorage.setItem(`level-${level}-room-${room}-button-${i}`, button.classList.contains('red') ? 'red' : 'green');
                checkRoomCompletion(level, room);
            });
            levelButtonsContainer.appendChild(button);
        }
        roomsDiv.style.display = 'none';
        levelContentDiv.style.display = 'block';
    }

    function checkRoomCompletion(level, room) {
        const buttons = Array.from(levelButtonsContainer.children);
        if (buttons.every(button => button.classList.contains('red'))) {
            document.querySelector(`.roomButton[data-level="${level}"][data-room="${room}"]`).classList.add('red');
            localStorage.setItem(`level-${level}-room-${room}-color`, 'red');
        } else {
            document.querySelector(`.roomButton[data-level="${level}"][data-room="${room}"]`).classList.remove('red');
            localStorage.setItem(`level-${level}-room-${room}-color`, 'green');
        }
        checkLevelCompletion(level);
    }
	


    function checkLevelCompletion(level) {
        const roomButtons = Array.from(document.querySelectorAll(`.roomButton[data-level="${level}"]`));
        if (roomButtons.every(button => button.classList.contains('red'))) {
            document.querySelector(`.levelButton[data-level="${level}"]`).classList.add('red');
            localStorage.setItem(`level-${level}-color`, 'red');
        } else {
            document.querySelector(`.levelButton[data-level="${level}"]`).classList.remove('red');
            localStorage.setItem(`level-${level}-color`, 'green');
        }
    }

    function resetLevels() {
        Object.keys(levelRooms).forEach(level => {
            // Reset room button colors to green
            Array.from(document.querySelectorAll(`.roomButton[data-level="${level}"]`)).forEach(button => {
                button.classList.remove('red');
                button.classList.add('green');
                localStorage.removeItem(`level-${level}-room-${button.dataset.room}-color`);
                resetRoomButtons(level, button.dataset.room);
            });

            // Reset level color to green
            const levelButton = document.querySelector(`.levelButton[data-level="${level}"]`);
            if (levelButton) {
                levelButton.classList.remove('red');
                levelButton.classList.add('green');
                localStorage.removeItem(`level-${level}-color`);
            }
        });
    }

    function resetRooms() {
        const level = getCurrentLevel();
        if (level) {
            levelRooms[level].forEach((numButtons, index) => {
                // Reset the room color and buttons
                resetRoomButtons(level, index + 1);

                const roomButton = document.querySelector(`.roomButton[data-level="${level}"][data-room="${index + 1}"]`);
                if (roomButton) {
                    roomButton.classList.remove('red');
                    roomButton.classList.add('green');
                    localStorage.removeItem(`level-${level}-room-${index + 1}-color`);
                }
            });
        }
    }

    function resetRoom() {
        const level = getCurrentLevel();
        const room = getCurrentRoom();
        if (level !== undefined && room !== undefined) {
            resetRoomButtons(level, room);
            const roomButton = document.querySelector(`.roomButton[data-level="${level}"][data-room="${room}"]`);
            if (roomButton) {
                roomButton.classList.remove('red');
                roomButton.classList.add('green');
                localStorage.removeItem(`level-${level}-room-${room}-color`);
            }
        }
    }

	function resetRoomButtons(level, room) {
		// Reset the buttons in the room based on the saved levelRooms structure
		for (let i = 1; i <= levelRooms[level][room - 1]; i++) {
			const button = document.querySelector(`#levelButtonsContainer button:nth-child(${i})`);
			if (button) {
				button.classList.remove('red');
				button.classList.add('green');
			}
			localStorage.removeItem(`level-${level}-room-${room}-button-${i}`);
		}
	}


    function getCurrentLevel() {
        return levelButtonsContainer.dataset.level;
    }

    function getCurrentRoom() {
        return levelButtonsContainer.dataset.room;
    }

function loadCustomizationOptions() {
    const customizationOptions = document.getElementById('customizationOptions');
    customizationOptions.innerHTML = '';
    Object.keys(levelRooms).forEach(level => {
        const levelDiv = document.createElement('div');
        levelDiv.classList.add('customizationLevel');
        levelDiv.innerHTML = `<strong>Level ${level}</strong>`;
        levelRooms[level].forEach((room, index) => {
            const roomDiv = document.createElement('div');
            roomDiv.classList.add('customizationRoom');
            roomDiv.innerHTML = `Room ${index + 1}: <input type="number" class="room-input" min="1" max="100" value="${room}" data-level="${level}" data-room="${index + 1}" />`;
            const deleteRoomButton = document.createElement('button');
            deleteRoomButton.textContent = 'Delete Room';
            deleteRoomButton.addEventListener('click', () => {
                levelRooms[level].splice(index, 1);
                loadCustomizationOptions();
            });
            roomDiv.appendChild(deleteRoomButton);
            levelDiv.appendChild(roomDiv);
        });
        const addRoomButton = document.createElement('button');
        addRoomButton.textContent = 'Add Room';
        addRoomButton.addEventListener('click', () => {
            levelRooms[level].push(1); // Default to 1 button in the new room
            loadCustomizationOptions();
        });
        levelDiv.appendChild(addRoomButton);
        const deleteLevelButton = document.createElement('button');
        deleteLevelButton.textContent = 'Delete Level';
        deleteLevelButton.addEventListener('click', () => {
            delete levelRooms[level];
            loadCustomizationOptions();
        });
        levelDiv.appendChild(deleteLevelButton);
        customizationOptions.appendChild(levelDiv);
    });
}


	function saveCustomization() {
		document.querySelectorAll('.room-input').forEach(input => {
			const level = input.dataset.level;
			const room = input.dataset.room;
			const numButtons = parseInt(input.value, 10);
			if (levelRooms[level]) {
				levelRooms[level][room - 1] = numButtons;
			}
		});
	}


    // Manual Code Transfer Functionality
    generateSaveCodeButton.addEventListener('click', () => {
        const saveData = {
            levelRooms: levelRooms,
            colors: {}
        };
		Object.keys(levelRooms).forEach(level => {
			saveData.colors[level] = {
				levelColor: localStorage.getItem(`level-${level}-color`) || 'green',
				rooms: {}
			};
			levelRooms[level].forEach((_, roomIndex) => {
				saveData.colors[level].rooms[roomIndex + 1] = {
					roomColor: localStorage.getItem(`level-${level}-room-${roomIndex + 1}-color`) || 'green',
					buttons: {}
				};
				for (let i = 1; i <= levelRooms[level][roomIndex]; i++) {
					saveData.colors[level].rooms[roomIndex + 1].buttons[i] = localStorage.getItem(`level-${level}-room-${roomIndex + 1}-button-${i}`) || 'green';
				}
			});
		});
		const saveCode = btoa(JSON.stringify(saveData));
		saveCodeOutput.textContent = saveCode;  // Use textContent instead of value
	});
	copySaveCodeButton.addEventListener('click', () => {
		saveCodeOutput.select(); // Select the text in the textarea
		document.execCommand('copy'); // Copy the selected text to clipboard
		alert('Save code copied to clipboard!');
	})

    loadSaveCodeButton.addEventListener('click', () => {
        const saveCode = saveCodeInput.value;
        try {
            const saveData = JSON.parse(atob(saveCode));
            levelRooms = saveData.levelRooms;
            Object.keys(saveData.colors).forEach(level => {
                const levelColor = saveData.colors[level].levelColor;
                localStorage.setItem(`level-${level}-color`, levelColor);

                Object.keys(saveData.colors[level].rooms).forEach(room => {
                    const roomColor = saveData.colors[level].rooms[room].roomColor;
                    localStorage.setItem(`level-${level}-room-${room}-color`, roomColor);

                    Object.keys(saveData.colors[level].rooms[room].buttons).forEach(button => {
                        const buttonColor = saveData.colors[level].rooms[room].buttons[button];
                        localStorage.setItem(`level-${level}-room-${room}-button-${button}`, buttonColor);
                    });
                });
            });
            saveLevelRooms();
            alert('Save data loaded successfully!');
        } catch (error) {
            alert('Invalid save code!');
        }
    });
});
