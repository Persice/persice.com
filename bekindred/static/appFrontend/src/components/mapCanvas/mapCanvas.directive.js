(function() {
    'use strict';

    /**
     * @desc display map
     * @example <map-canvas></map-canvas>
     */
    angular
        .module('persice')
        .directive('mapCanvas', mapCanvas);

    function mapCanvas($compile) {
        var directive = {
            restrict: 'E',
            link: link,
            replace: true,
            template: '<div></div>',
        };
        return directive;

        function link(scope, element, attrs, filter) {

            scope.$on('drawMap', function(e, data) {
                drawMap(data.locations, data.center);
            });


            scope.$on('drawMapWithoutCenter', function(e, data) {
                drawMapWithoutCenter(data);
            });



            function drawMap(locations, center) {
                var map = new google.maps.Map(element[0], {
                    zoom: 15,
                    center: new google.maps.LatLng(center.latitude, center.longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                var markers = [];

                for (i = 0; i < locations.length; i++) {
                    marker = new google.maps.Marker({
                        id: locations[i].id,
                        position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
                        map: map,
                        title: locations[i].title,
                        animation: google.maps.Animation.DROP,
                        icon: locations[i].icon,
                    });
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            //add direct link to event when clicked on event name
                            if (locations[i].id !== null) {
                                var htmlElement = '<a href="" ng-click="eventsmap.gotoEvent(' + locations[i].id + ')">' + locations[i].title + '</a>';
                                var compiled = $compile(htmlElement)(scope);
                                infowindow.setContent(compiled[0]);
                            } else {
                                infowindow.setContent(locations[i].title);
                            }
                            infowindow.open(map, marker);

                        }
                    })(marker, i));
                }

                //set zoom level to show at least two closest markers

                var closestMarkers = findClosestN(center, 4, markers);

                var bounds = new google.maps.LatLngBounds();
                for (i = 0; i < closestMarkers.length; i++) {
                    bounds.extend(closestMarkers[i].getPosition());
                }
                map.fitBounds(bounds);

                //remove one zoom level to ensure no marker is on the edge.
                map.setZoom(map.getZoom() - 1);

                // set a minimum zoom
                // if we have only 1 marker or all markers are on the same address map will be zoomed too much.
                if (map.getZoom() > 15) {
                    map.setZoom(15);
                }
            }

            function drawMapWithoutCenter(locations) {
                var map = new google.maps.Map(element[0], {
                    zoom: 5,
                    center: new google.maps.LatLng(0, 0),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                var markers = [];

                for (i = 0; i < locations.length; i++) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
                        map: map,
                        title: locations[i].title,
                        animation: google.maps.Animation.DROP,
                        icon: locations[i].icon,
                    });
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infowindow.setContent(locations[i].title);
                            infowindow.open(map, marker);
                        }
                    })(marker, i));
                }


                var bounds = new google.maps.LatLngBounds();
                for (i = 0; i < markers.length; i++) {
                    bounds.extend(markers[i].getPosition());
                }
                map.fitBounds(bounds);


            }


            function sortByDist(a, b) {
                return (a.distance - b.distance)
            }

            function findClosestN(pt, numberOfResults, data) {
                var closest = [];
                var point = new google.maps.LatLng(pt.latitude, pt.longitude);
                for (var i = 0; i < data.length; i++) {
                    data[i].distance = google.maps.geometry.spherical.computeDistanceBetween(point, data[i].getPosition());
                    closest.push(data[i]);
                }
                closest.sort(sortByDist);
                return closest.splice(0, numberOfResults);
            }


        }



    }





})();
