app.factory('LxDatePickerService', [function() {

    var dtPickerService = {};
    function avoidOpeningTwoDatePickers(ev) {
        if (!angular.element('.lx-date-picker--is-shown').length == 0) {
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }
    }

    function disableClicks(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    }

    dtPickerService.handleClicks = function (id) {
        angular.element('#' + id)[0].addEventListener('click', avoidOpeningTwoDatePickers, true);
    };

    dtPickerService.endHandleClicks = function(id) {
        angular.element('#' + id)[0].removeEventListener('click', avoidOpeningTwoDatePickers, true);
    };

    dtPickerService.disableAll = function(id) {
        var dtPicker = angular.element('.lx-date');
        dtPicker.prop('disabled');
        dtPicker.each(function(index, picker) {
            picker.addEventListener('click', disableClicks, true);
        });

    };
    dtPickerService.enableAll = function(id) {
        var dtPicker = angular.element('.lx-date');
        dtPicker.removeProp('disabled');
        dtPicker.each(function(index, picker) {
            picker.removeEventListener('click', disableClicks, true);
        });
    };

    return dtPickerService;
}]);