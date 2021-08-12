document.getElementById("search-button").addEventListener("click", function() {
    // Get the search input value
    var searchValue = document.getElementById("search-input").value;
    // Perform the search functionality
    searchPanels(searchValue);
});

function searchPanels(searchValue) {
    // Send a GET request to the server with the search value
    fetch("/search?value=" + searchValue)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Clear the existing panels
            var tableBody = document.getElementById("panels-table-body");
            tableBody.innerHTML = "";
            // Add the new panels
            data.forEach(function(panel) {
                var row = document.createElement("tr");
                row.innerHTML = "<td>" + panel.name + "</td><td>" + panel.sampleType + "</td><td>" + panel.application + "</td><td>" + panel.cellMarkers.join(", ") + "</td>";
                tableBody.appendChild(row);
            });
        });
}

document.getElementById("filter-button").addEventListener("click", function() {
    // Get the selected sample type and application
    var sampleType = document.getElementById("sample-type").value;
    var application = document.getElementById("application").value;
    // Get the selected cell markers
    var cellMarkers = [];
    if (document.getElementById("cell-marker-1").checked) {
        cellMarkers.push(document.getElementById("cell-marker-1").value);
    }
    if (document.getElementById("cell-marker-2").checked) {
        cellMarkers.push(document.getElementById("cell-marker-2").value);
    }
    // Perform the filtering functionality
    filterPanels(sampleType, application, cellMarkers);
});

function filterPanels(sampleType, application, cellMarkers) {
    // Send a GET request to the server with the filter options
    fetch("/filter?sampleType=" + sampleType + "&application=" + application + "&cellMarkers=" + cellMarkers.join(","))
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Clear the existing panels
            var tableBody = document.getElementById("panels-table-body");
            tableBody.innerHTML = "";
            // Add the new panels
            data.forEach(function(panel) {
                var row = document.createElement("tr");
                row.innerHTML = "<td>" + panel.name + "</td><td>" + panel.sampleType + "</td><td>" + panel.application + "</td><td>" + panel.cellMarkers.join(", ") + "</td>";
                tableBody.appendChild(row);
            });
        });
}

//Initialize autocomplete
var searchInput = document.getElementById("search-input");
var searchAutocomplete = new Awesomplete(searchInput);

//Fetch search suggestions from the server
searchInput.addEventListener("input", function() {
    var searchValue = searchInput.value;
    if (searchValue.length >= 3) {
        fetch("/search/suggestions?value=" + searchValue)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                searchAutocomplete.list = data;
            });
    }
});

//Handle search button click
document.getElementById("search-button").addEventListener("click", function() {
    var searchValue = searchInput.value;
    searchPanels(searchValue);
});

function searchPanels(searchValue) {
    // Send a GET request to the server with the search value
    fetch("/search?value=" + searchValue)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Clear the existing panels
            var tableBody = document.getElementById("panels-table-body");
            tableBody.innerHTML = "";
            // Add the new panels
            data.forEach(function(panel) {
                var row = document.createElement("tr");
                row.innerHTML = "<td>" + panel.name + "</td><td>" + panel.sampleType + "</td><td>" + panel.application + "</td><td>" + panel.cellMarkers.join(", ") + "</td>";
                tableBody.appendChild(row);
            });
        });
}

var filterOptions = {
    sampleType: "",
    application: "",
    cellMarkers: []
};

//Handle sample type select change
document.getElementById("sample-type").addEventListener("change", function() {
    filterOptions.sampleType = this.value;
    filterPanels();
});

//Handle application select change
document.getElementById("application").addEventListener("change", function() {
    filterOptions.application = this.value;
    filterPanels();
});

//Handle cell marker checkboxes change
var cellMarkerCheckboxes = document.querySelectorAll("input[name='cell-markers']");
cellMarkerCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function() {
        if (this.checked) {
            filterOptions.cellMarkers.push(this.value);
        } else {
            filterOptions.cellMarkers.splice(filterOptions.cellMarkers.indexOf(this.value), 1);
        }
        filterPanels();
    });
});

//Handle filter button click
document.getElementById("filter-button").addEventListener("click", filterPanels);


function filterPanels() {
    var searchTerm = $('#search-input').val().toLowerCase();
    $('.panel').each(function() {
        var panelText = $(this).text().toLowerCase();
        if (panelText.indexOf(searchTerm) !== -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

var page = 1;
$("#load-more-button").click(function() {
    loadMorePanels();
});

function loadMorePanels() {
    // Send a GET request to the server for more panels
    $.get("/panels?page=" + page)
        .done(function(data) {
            if (data.length > 0) {
                // Add the new panels
                $.each(data, function(index, panel) {
                    var row = $("<tr>").append(
                        $("<td>").text(panel.name),
                        $("<td>").text(panel.sampleType),
                        $("<td>").text(panel.application),
                        $("<d>").text(panel.cellMarkers.join(", ")));
                    $("#panels-table-body").append(row);
                });
            page++;
        } else {
// Disable the "Load More" button
        $("#load-more-button").attr("disabled", true);
        }
    });
}
