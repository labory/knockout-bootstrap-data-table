Knockout pageable data table
=============================

###Usage
![Basic Example](https://raw.github.com/labory/knockout-bootstrap-data-table/master/assets/basic-example.png)
###View

    <table data-bind="dataTable: tableViewModel"/>

###ViewModel

    $(function () {
        var ExamplePageViewModel = function() {
            var self = this;
            self.getData = function (page, size, callback) {
                var params = "?page.page=" + (page) + "&page.size=" + size;
                $.getJSON("/frameworks" + params, callback);
            };
            self.tableViewModel = new ko.dataTable.ViewModel({
                columns: [
                    { name: "FRAMEWORK", value: "name" },
                    { name: "LICENSE", value: "license" },
                    { name: "DEPENDENCY", value: "dependency" },
                    { name: "SIZE (Gzipped)", value: function (item) { return item.size != '' ? item.size + ' kb' : ''} }
                ],
                loader: self.getData,
                pageSize: 10
            });
        };
        ko.applyBindings(new ExamplePageViewModel());
    });

###Dependencies
  * Knockout
  * Jquery
  * bootstrap pagination css
