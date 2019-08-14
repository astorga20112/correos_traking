$(document).ready(function() {
    var codes = [];
    var items = [];
    var days = [];
    $.ajax({
        dataType: "json",
        url: "codes.php",
        success: function(data) {

            for (var i = 0; i < data.length; i++) {
                if (data[i]["Estado"] != "Recibido" && data[i]["Codigo de Seguimiento"].length != 0) {
                    codes.push(data[i]["Codigo de Seguimiento"]);
                    items.push(data[i]["Item"]);
                    days.push(data[i]["Demora"]);
                }
            };

            $.each(codes, function(index, value) {

                $("#results").append("<tr  id='result'>" + "<td  id='days'>" + days[index] + "</td>" + "<td  id='code'>" 	+ "<a target='_blank' href='https://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio=" + value + "' >"  + value + "</a>" + "</td>" + "<td  id='item'>" + items[index] + "</td>" + "<td id='state'>" + 'loading' + "</td>" + "<td  id='place'>" + 'loading' + "</td>" + "<td  id='date'>" + 'loading' + "</td>" + "</tr>")


            });
        },
        complete: function(data) {
            var results_table = $("#results").DataTable({
                "paging":false,
                "aaSorting": [0, 'desc'],
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                            if ( aData[4] == "SUCURSAL LA CISTERNA" || aData[3] == "ENVIO ENTREGADO" )
                            {
                                $('td', nRow).css('background-color', '#8DFF9A');
                                $('td', nRow).addClass("pickUp");
                                $('td', nRow).removeClass("inTransit");
                            }
        
                        }
            });
            $('#results > tbody  > tr').each(function() {
                code = $(this).find("#code").text();
                var $this = $(this);
                $.ajax({
                    dataType: "json",
                    url: "api.php?code=" + code,
                    success: function(data) {
                        if (data['historial'].length > 0) {
                            state = data['historial'][0]['Estado'];
                            place = data['historial'][0]['Oficina'];
                            date = data['historial'][0]['Fecha'];
                            results_table.cell($this.find("#state")).data(state)
                            results_table.cell($this.find("#place")).data(place)
                            results_table.cell($this.find("#date")).data(date)
                        } else {
                            results_table.cell($this.find("#state")).data('error')
                            results_table.cell($this.find("#place")).data('error')
                            results_table.cell($this.find("#date")).data('error')
                        }
                        
                    },
                    complete: function() {
                        results_table.draw();
                    },
                    error: function() {
                        
                    },
    
                    async: true,
                });
                
            });
            
        },
        async: true,
    });
});