document.addEventListener("DOMContentLoaded", () => {
    const extensionsList = document.getElementById("extensions-list");
    const showAllBtn = document.getElementById("show-all");
    const showActiveBtn = document.getElementById("show-active");
    const showInactiveBtn = document.getElementById("show-inactive");
    const searchBox = document.getElementById("search-box");
    const autocompleteList = document.getElementById("autocomplete-list");

    let extensionsData = [];

    // Load extensions from JSON
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            extensionsData = data;
            renderExtensions(extensionsData);
        });

    function renderExtensions(extensions) {
     // clear the extenions list before rendering new items
        extensionsList.innerHTML = "";
        // for each extension, create a card and append it to the extensions list
        extensions.forEach(extension => {
            const extensionCard = document.createElement("div");
            extensionCard.classList.add("extension-card");

            extensionCard.innerHTML = `
         

                <div class="extension-info">
                 <img src="${extension.logo}" alt="${extension.name}">
                    <h2>${extension.name}</h2>
                    <p>${extension.description}</p>
                </div>
               

                <label class="toggle-switch">
                    <input type="checkbox" ${extension.isActive ? "checked" : ""} data-name="${extension.name}">
                    <span class="toggle-slider"></span>
                </label>
            `;

            extensionsList.appendChild(extensionCard);
        });
    }

    function filterExtensions(query) {
        const filteredExtensions = extensionsData.filter(ext =>
            ext.name.toLowerCase().includes(query.toLowerCase())
        );
        renderExtensions(filteredExtensions);
    }

    searchBox.addEventListener("input", () => {
        const query = searchBox.value;
        filterExtensions(query);

        // Autocomplete suggestions
        autocompleteList.innerHTML = "";
        if (query) {
            const matches = extensionsData.filter(ext =>
                ext.name.toLowerCase().startsWith(query.toLowerCase())
            );

            if (matches.length) {
                autocompleteList.style.display = "block";
                matches.forEach(ext => {
                    const item = document.createElement("li");
                    item.textContent = ext.name;
                    item.classList.add("autocomplete-item");

                    item.addEventListener("click", () => {
                        searchBox.value = ext.name;
                        autocompleteList.style.display = "none";
                        renderExtensions([ext]); 
                    });

                    autocompleteList.appendChild(item);
                });
            } else {
                autocompleteList.style.display = "none";
            }
        } else {
            autocompleteList.style.display = "none";
        }
    });

    showAllBtn.addEventListener("click", () => renderExtensions(extensionsData));
    showActiveBtn.addEventListener("click", () => renderExtensions(extensionsData.filter(ext => ext.isActive)));
    showInactiveBtn.addEventListener("click", () => renderExtensions(extensionsData.filter(ext => !ext.isActive)));
});
