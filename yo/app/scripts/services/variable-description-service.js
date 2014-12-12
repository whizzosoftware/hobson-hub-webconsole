'use strict';

angular.module('hobsonApp').
  factory('VariableDescriptionService', [

    function() {
      var descriptions = {
        ecw: 'Energy Consumption (W)',
        targetCoolTempF: 'Cool Setpoint (F)',
        targetHeatTempF: 'Heat Setpoint (F)',
        tempF: 'Temperature (F)'
      };

      var getDescription = function(varName) {
        var d = descriptions[varName];
        if (d) {
          return d;
        } else {
          return varName;
        }
      };

      return {
        getDescription: getDescription
      };
    }]);
