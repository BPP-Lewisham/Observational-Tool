Survey
    .StylesManager
    .applyTheme("modern");




var json = {
    "questions": [
        {//Should this be a multiple thing or just one choice?
            //Put them in alphabetical order
            "type": "checkbox",
            "name": "weather",
            "title": "Weather",
            "isRequired": true,
            "colCount": 1,
            "choices": [
                "Cloudy",
                "Rainy",
                "Sunny",
                "Windy",
                "Overcast"
            ]
        },
        {
            "name": "state",
            "type": "radiogroup",
            "title": "State",
            "colCount": 1,
            "choices": [
                            "Alone", "Family Group", "Other Group"
                        ],
            "isRequired": true
        },   
        {
            "type": "matrixdynamic",
            "name": "parkUsers",
            "title": "Please fill in data for each individual (Scroll horizontally)",
            "addRowText": "Add More Participants",
            "minRowCount": 1,
            "allowAddRows": false,
            "horizontalScroll": true,
            "columnMinWidth": "245px",
            "columnColCount": 1,
            "rowCount": 1,
            "columns": [
                    {
                        "name": "gender",
                        "cellType": "radiogroup",
                        "title": "Gender",
                        "colCount": 1,
                        "choices": [
                                        "Male", "Female"
                                    ],
                        "isRequired": true
                    }, 
                    {
                        "name": "zone",
                        "cellType": "radiogroup",
                        "title": "Zone",
                        "colCount": 1,
                        "choices": [
                            "Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"
                        ],
                        "isRequired": true
                    },
                    {
                        "name": "age",
                        "cellType": "radiogroup",
                        "title": "Age",
                        "colCount": 1,
                        "choices": [
                            "0-4", "5-16", "17-24", "25-49", "50-69","70+"
                        ],
                        "isRequired": true
                    },
                    {
                        "name": "background",
                        "cellType": "radiogroup",
                        "title": "Cultural Background",
                        "colCount": 1,
                        "choices": [
                                        "White", "Black", "Asian", "Other"
                                    ],
                        "isRequired": true
                    },   
                    {
                        "name": "dog",
                        "cellType": "radiogroup",
                        "title": "With Dog",
                        "colCount": 1,
                        "choices": [
                                        "No", "4 or less", "More than 4"
                                    ],
                        "isRequired": true
                    },   
                    {
                        "name": "disability",
                        "cellType": "radiogroup",
                        "title": "Disability",
                        "colCount": 1,
                        "choices": [
                                        "Yes", "No"
                                    ],
                        "isRequired": true
                    },               
                    {
                        "name": "activities",
                        "cellType": "checkbox",
                        "title": "Activities",
                        "colCount": 1,
                        "choices": [
                                    "Walking Dog","Walking", "Running", "Leisure Cycling", "Off Road Cycling", "BMX", "Skate Park", "Sports", "Swimming", "Children's Playground", "Buggy/Pram", "Standing", "Sitting", "Wheelchair/Mobility Scooter", "Cafe", "Other"
                                    ],
                        "isRequired": true
                    }
                ]            
        },
        {
            name: "comment",
            type: "text",
            title: "Any Comments?",
            defaultValue: "1) ",
            isRequired: false
        }
    ]
};

window.survey = new Survey.Model(json);
survey.showCompletedPage = false;


function resetParkUserRows(){
    var numberOfRows = survey.getQuestionByName("parkUsers").visibleRows.length
    for (var i = numberOfRows - 1; i > 0; i--){
        survey.getQuestionByName("parkUsers").removeRow(i)
    }
}


survey.onMatrixRowAdded.add(function(sender, options){
    if(!defaultInsertRow){
        var question = options.row.cells[1].question; //The first cell is readOnly
        setTimeout(function() {
            question.focus()
        }, 300);
    }

});

survey
    .onValueChanged
    .add(function(sender, options) {
        if(options.name !== "state"){return}
        if(options.value === "Alone"){
            defaultInsertRow = true
            initialSetupQuestion2 = true;
            resetParkUserRows();
            survey.getQuestionByName("parkUsers").allowAddRows = false;
        }
        else{
            survey.getQuestionByName("parkUsers").allowAddRows = true;
            
            if(initialSetupQuestion2){
                survey.getQuestionByName("parkUsers").addRow();
                defaultInsertRow = false;
                initialSetupQuestion2 = false;
            }
        }
});

survey
    .onComplete
    .add(function (result) {
        res = result.data
        res.latitude = latitude;
        res.longitude = longitude;
        res.weather = res.weather.sort()
        console.log(res)
        prevDateTime = "none"
        curDateTime = Date().toLocaleString()
        counter = 0
        defaultInsertRow = true;
        initialSetupQuestion2 = true;
        resetParkUserRows();
        survey.getQuestionByName("parkUsers").allowAddRows = false;

        survey.clear();

        document.body.scrollTop = document.documentElement.scrollTop = 0;
        //console.log(survey)
        d3.selectAll('#dot').remove()
        var tempObj = JSON.parse(JSON.stringify(res));
        delete tempObj.parkUsers
        objArray = []
        for (var i = 0; i < res.parkUsers.length; i++){
            res.parkUsers[i].activities = res.parkUsers[i].activities.sort()
            objArray.push(Object.assign({},tempObj ,res.parkUsers[i]))
        }
        objArray.map(setLocalStorage)
        updateNumberOfEnteries()
        reload = true
        latitude = "none"
        longitude = "none"
    });

function onAngularComponentInit() {
    Survey
        .SurveyNG
        .render("surveyElement", {model: survey});
}
var HelloApp = ng
    .core
    .Component({selector: 'ng-app', template: '<div id="surveyContainer" class="survey-container contentcontainer codecontainer"><div id="surveyElement"></div></div> '})
    .Class({
        constructor: function () {},
        ngOnInit: function () {
            onAngularComponentInit();
        }
    });
document.addEventListener('DOMContentLoaded', function () {
    ng
        .platformBrowserDynamic
        .bootstrap(HelloApp);
});