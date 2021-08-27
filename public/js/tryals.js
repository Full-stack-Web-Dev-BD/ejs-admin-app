$(document).ready(function(){
    function updateInputs() {
        var inputtype = $( "#inputtype" ).val();
        $("#checkboxvalues").toggle(inputtype === "Checkbox" || inputtype === "Checkbox with Other");
        $("#radiovalues").toggle(inputtype === "Radio" || inputtype === "Radio with Other");
        $("#dropdownvalues").toggle(inputtype === "Dropdown");
    }
    updateInputs();
    $('#inputtype').on('change', updateInputs)

    var submitBtn = $('input[type="submit"]');

});