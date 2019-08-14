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
            $('#results > tbody  > tr').each(function() {
                code = $(this).find("#code").text();
                var $this = $(this);
                $.ajax({
                    dataType: "json",
                    url: "https://fabianvillena.cl/correos/" + code,
                    success: function(data) {
                        state = data['registros'][0]['estado'];
                        place = data['registros'][0]['lugar'];
                        date = data['registros'][0]['fecha'];
                        $this.find("#state").html(state)
                        $this.find("#place").html(place)
                        $this.find("#date").html(date)
                    },
                    complete: function() {},
                    error: function() {
                        $this.find("#state").html('error')
                        $this.find("#place").html('error')
                        $this.find("#date").html('error')
                    },
    
                    async: true,
                });
                
            });
            $("#results").dataTable({
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
        },
        async: true,
    });
});