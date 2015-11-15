'use strict';

angular.module('27th.acmi.directives.linkErrors', [])
    .directive('linkErrors', function () {
        return {
            restrict: 'A',
            require: '^form',
            link: function (scope, el, attrs, formControl) {
                var input = angular.element(el[0].querySelector('[name]'));
                var name = input.attr('name');
                input.bind('blur', () => {
                    el.toggleClass('has-error', formControl[name].$invalid);
                });
            }
        };
    });
