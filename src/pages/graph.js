import React from 'react';

const html = `
<html>
<head>
    <meta charset="utf-8">
    
        <script src="lib/bindings/utils.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.2/dist/dist/vis-network.min.css" integrity="sha512-WgxfT5LWjfszlPHXRmBWHkV2eceiWTOBvrKCNbdgDYTHrT2AeLCGbF4sZlZw3UMN3WtL0tGUoIAKsu8mllg/XA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.2/dist/vis-network.min.js" integrity="sha512-LnvoEWDFrqGHlHmDD2101OrLcbsfkrzoSpvtSQtxK3RMnRV0eOkhhBN2dXHKRrUU8p2DGRTk35n4O8nWSVe1mQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<center>
<h1></h1>
</center>

<!-- <link rel="stylesheet" href="../node_modules/vis/dist/vis.min.css" type="text/css" />
<script type="text/javascript" src="../node_modules/vis/dist/vis.js"> </script>-->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
      crossorigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
      crossorigin="anonymous"
    ></script>

    <center>
      <h1></h1>
    </center>
    <style type="text/css">
         #mynetwork {
             width: 100vw;
             height: 100vh;
             background-color: #ffffff;
             border: 1px solid lightgray;
             position: relative;
             float: left;
         }

         #config {
             float: left;
             width: 400px;
             height: 600px;
         }
    </style>
</head>

<body>
    <div class="card" style="width: 100%">
        <div id="mynetwork" class="card-body"></div>
    </div>
        <div id="config"></div>
    
    <script type="text/javascript">

          // initialize global variables.
          var edges;
          var nodes;
          var allNodes;
          var allEdges;
          var nodeColors;
          var originalNodes;
          var network;
          var container;
          var options, data;
          var filter = {
              item : '',
              property : '',
              value : []
          };

          // This method is responsible for drawing the graph, returns the drawn network
          function drawGraph() {
              var container = document.getElementById('mynetwork');
              // parsing and collecting nodes and edges from the python
              nodes = new vis.DataSet([{"color": "#97c2fc", "id": "Dawrin 1859", "label": "Dawrin 1859", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Dawkins 1967", "label": "Dawkins 1967", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Allen 1983", "label": "Allen 1983", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Schmidhuber 1987", "label": "Schmidhuber 1987", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Koza 1994", "label": "Koza 1994", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Kennedy 1995", "label": "Kennedy 1995", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Ha 2018", "label": "Ha 2018", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Matsuo 2022", "label": "Matsuo 2022", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Tran 2016", "label": "Tran 2016", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Tran 2019", "label": "Tran 2019", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Wood 2022", "label": "Wood 2022", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Pardo 2016", "label": "Pardo 2016", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Black 2019", "label": "Black 2019", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Black 2017", "label": "Black 2017", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Bi 2019", "label": "Bi 2019", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Matyushin 2020", "label": "Matyushin 2020", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Robinson 2021", "label": "Robinson 2021", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Robinson 2022", "label": "Robinson 2022", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Kullback 1951", "label": "Kullback 1951", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Linnainmaa 1970", "label": "Linnainmaa 1970", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Fukushima 1982", "label": "Fukushima 1982", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "LeCun 1989", "label": "LeCun 1989", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Hochreiters 1997", "label": "Hochreiters 1997", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "LeCun 1998", "label": "LeCun 1998", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Krizchevsky 2012", "label": "Krizchevsky 2012", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Simonyan 2014", "label": "Simonyan 2014", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Goodfellow 2014", "label": "Goodfellow 2014", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Szgedy 2015", "label": "Szgedy 2015", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "He 2016", "label": "He 2016", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Vaswani 2017", "label": "Vaswani 2017", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Song 2020", "label": "Song 2020", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Ho 2020", "label": "Ho 2020", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "He 2023", "label": "He 2023", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Wood 2023", "label": "Wood 2023", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Zhang 2008", "label": "Zhang 2008", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Khakimov 2015", "label": "Khakimov 2015", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Gonzalez 2014", "label": "Gonzalez 2014", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Balog 2019", "label": "Balog 2019", "shape": "dot", "size": 10}, {"color": "#97c2fc", "id": "Balog 2010", "label": "Balog 2010", "shape": "dot", "size": 10}]);
              edges = new vis.DataSet([{"from": "Dawrin 1859", "to": "Dawkins 1967", "width": 1}, {"from": "Dawrin 1859", "to": "Allen 1983", "width": 1}, {"from": "Dawrin 1859", "to": "Schmidhuber 1987", "width": 1}, {"from": "Dawrin 1859", "to": "Koza 1994", "width": 1}, {"from": "Dawrin 1859", "to": "Kennedy 1995", "width": 1}, {"from": "Dawrin 1859", "to": "Ha 2018", "width": 1}, {"from": "Dawrin 1859", "to": "Matsuo 2022", "width": 1}, {"from": "Dawrin 1859", "to": "Tran 2016", "width": 1}, {"from": "Dawrin 1859", "to": "Tran 2019", "width": 1}, {"from": "Dawrin 1859", "to": "Wood 2022", "width": 1}, {"from": "Dawkins 1967", "to": "Allen 1983", "width": 1}, {"from": "Dawkins 1967", "to": "Schmidhuber 1987", "width": 1}, {"from": "Dawkins 1967", "to": "Koza 1994", "width": 1}, {"from": "Dawkins 1967", "to": "Kennedy 1995", "width": 1}, {"from": "Dawkins 1967", "to": "Ha 2018", "width": 1}, {"from": "Dawkins 1967", "to": "Matsuo 2022", "width": 1}, {"from": "Dawkins 1967", "to": "Tran 2016", "width": 1}, {"from": "Dawkins 1967", "to": "Tran 2019", "width": 1}, {"from": "Dawkins 1967", "to": "Wood 2022", "width": 1}, {"from": "Allen 1983", "to": "Schmidhuber 1987", "width": 1}, {"from": "Allen 1983", "to": "Koza 1994", "width": 1}, {"from": "Allen 1983", "to": "Kennedy 1995", "width": 1}, {"from": "Allen 1983", "to": "Ha 2018", "width": 1}, {"from": "Allen 1983", "to": "Matsuo 2022", "width": 1}, {"from": "Allen 1983", "to": "Tran 2016", "width": 1}, {"from": "Allen 1983", "to": "Tran 2019", "width": 1}, {"from": "Allen 1983", "to": "Wood 2022", "width": 1}, {"from": "Schmidhuber 1987", "to": "Koza 1994", "width": 1}, {"from": "Schmidhuber 1987", "to": "Kennedy 1995", "width": 1}, {"from": "Schmidhuber 1987", "to": "Ha 2018", "width": 1}, {"from": "Schmidhuber 1987", "to": "Matsuo 2022", "width": 1}, {"from": "Schmidhuber 1987", "to": "Tran 2016", "width": 1}, {"from": "Schmidhuber 1987", "to": "Tran 2019", "width": 1}, {"from": "Schmidhuber 1987", "to": "Wood 2022", "width": 1}, {"from": "Koza 1994", "to": "Kennedy 1995", "width": 1}, {"from": "Koza 1994", "to": "Ha 2018", "width": 1}, {"from": "Koza 1994", "to": "Matsuo 2022", "width": 1}, {"from": "Koza 1994", "to": "Tran 2016", "width": 1}, {"from": "Koza 1994", "to": "Tran 2019", "width": 1}, {"from": "Koza 1994", "to": "Wood 2022", "width": 1}, {"from": "Kennedy 1995", "to": "Ha 2018", "width": 1}, {"from": "Kennedy 1995", "to": "Matsuo 2022", "width": 1}, {"from": "Kennedy 1995", "to": "Tran 2016", "width": 1}, {"from": "Kennedy 1995", "to": "Tran 2019", "width": 1}, {"from": "Kennedy 1995", "to": "Wood 2022", "width": 1}, {"from": "Ha 2018", "to": "Matsuo 2022", "width": 1}, {"from": "Ha 2018", "to": "Tran 2016", "width": 1}, {"from": "Ha 2018", "to": "Tran 2019", "width": 1}, {"from": "Ha 2018", "to": "Wood 2022", "width": 1}, {"from": "Matsuo 2022", "to": "Tran 2016", "width": 1}, {"from": "Matsuo 2022", "to": "Tran 2019", "width": 1}, {"from": "Matsuo 2022", "to": "Wood 2022", "width": 1}, {"from": "Tran 2016", "to": "Tran 2019", "width": 1}, {"from": "Tran 2016", "to": "Wood 2022", "width": 1}, {"from": "Tran 2019", "to": "Wood 2022", "width": 1}, {"from": "Wood 2022", "to": "Pardo 2016", "width": 1}, {"from": "Wood 2022", "to": "Black 2019", "width": 1}, {"from": "Wood 2022", "to": "Black 2017", "width": 1}, {"from": "Wood 2022", "to": "Bi 2019", "width": 1}, {"from": "Wood 2022", "to": "Matyushin 2020", "width": 1}, {"from": "Wood 2022", "to": "Robinson 2021", "width": 1}, {"from": "Wood 2022", "to": "Robinson 2022", "width": 1}, {"from": "Kullback 1951", "to": "Linnainmaa 1970", "width": 1}, {"from": "Kullback 1951", "to": "Fukushima 1982", "width": 1}, {"from": "Kullback 1951", "to": "LeCun 1989", "width": 1}, {"from": "Kullback 1951", "to": "Hochreiters 1997", "width": 1}, {"from": "Kullback 1951", "to": "LeCun 1998", "width": 1}, {"from": "Kullback 1951", "to": "Krizchevsky 2012", "width": 1}, {"from": "Kullback 1951", "to": "Simonyan 2014", "width": 1}, {"from": "Kullback 1951", "to": "Goodfellow 2014", "width": 1}, {"from": "Kullback 1951", "to": "Szgedy 2015", "width": 1}, {"from": "Kullback 1951", "to": "He 2016", "width": 1}, {"from": "Kullback 1951", "to": "Vaswani 2017", "width": 1}, {"from": "Kullback 1951", "to": "Song 2020", "width": 1}, {"from": "Kullback 1951", "to": "Ho 2020", "width": 1}, {"from": "Kullback 1951", "to": "He 2023", "width": 1}, {"from": "Kullback 1951", "to": "Wood 2023", "width": 1}, {"from": "Linnainmaa 1970", "to": "Fukushima 1982", "width": 1}, {"from": "Linnainmaa 1970", "to": "LeCun 1989", "width": 1}, {"from": "Linnainmaa 1970", "to": "Hochreiters 1997", "width": 1}, {"from": "Linnainmaa 1970", "to": "LeCun 1998", "width": 1}, {"from": "Linnainmaa 1970", "to": "Krizchevsky 2012", "width": 1}, {"from": "Linnainmaa 1970", "to": "Simonyan 2014", "width": 1}, {"from": "Linnainmaa 1970", "to": "Goodfellow 2014", "width": 1}, {"from": "Linnainmaa 1970", "to": "Szgedy 2015", "width": 1}, {"from": "Linnainmaa 1970", "to": "He 2016", "width": 1}, {"from": "Linnainmaa 1970", "to": "Vaswani 2017", "width": 1}, {"from": "Linnainmaa 1970", "to": "Song 2020", "width": 1}, {"from": "Linnainmaa 1970", "to": "Ho 2020", "width": 1}, {"from": "Linnainmaa 1970", "to": "He 2023", "width": 1}, {"from": "Fukushima 1982", "to": "LeCun 1989", "width": 1}, {"from": "Fukushima 1982", "to": "Hochreiters 1997", "width": 1}, {"from": "Fukushima 1982", "to": "LeCun 1998", "width": 1}, {"from": "Fukushima 1982", "to": "Krizchevsky 2012", "width": 1}, {"from": "Fukushima 1982", "to": "Simonyan 2014", "width": 1}, {"from": "Fukushima 1982", "to": "Goodfellow 2014", "width": 1}, {"from": "Fukushima 1982", "to": "Szgedy 2015", "width": 1}, {"from": "Fukushima 1982", "to": "He 2016", "width": 1}, {"from": "Fukushima 1982", "to": "Vaswani 2017", "width": 1}, {"from": "Fukushima 1982", "to": "Song 2020", "width": 1}, {"from": "Fukushima 1982", "to": "Ho 2020", "width": 1}, {"from": "Fukushima 1982", "to": "He 2023", "width": 1}, {"from": "LeCun 1989", "to": "Hochreiters 1997", "width": 1}, {"from": "LeCun 1989", "to": "LeCun 1998", "width": 1}, {"from": "LeCun 1989", "to": "Krizchevsky 2012", "width": 1}, {"from": "LeCun 1989", "to": "Simonyan 2014", "width": 1}, {"from": "LeCun 1989", "to": "Goodfellow 2014", "width": 1}, {"from": "LeCun 1989", "to": "Szgedy 2015", "width": 1}, {"from": "LeCun 1989", "to": "He 2016", "width": 1}, {"from": "LeCun 1989", "to": "Vaswani 2017", "width": 1}, {"from": "LeCun 1989", "to": "Song 2020", "width": 1}, {"from": "LeCun 1989", "to": "Ho 2020", "width": 1}, {"from": "LeCun 1989", "to": "He 2023", "width": 1}, {"from": "LeCun 1989", "to": "Wood 2023", "width": 1}, {"from": "Hochreiters 1997", "to": "LeCun 1998", "width": 1}, {"from": "Hochreiters 1997", "to": "Krizchevsky 2012", "width": 1}, {"from": "Hochreiters 1997", "to": "Simonyan 2014", "width": 1}, {"from": "Hochreiters 1997", "to": "Goodfellow 2014", "width": 1}, {"from": "Hochreiters 1997", "to": "Szgedy 2015", "width": 1}, {"from": "Hochreiters 1997", "to": "He 2016", "width": 1}, {"from": "Hochreiters 1997", "to": "Vaswani 2017", "width": 1}, {"from": "Hochreiters 1997", "to": "Song 2020", "width": 1}, {"from": "Hochreiters 1997", "to": "Ho 2020", "width": 1}, {"from": "Hochreiters 1997", "to": "He 2023", "width": 1}, {"from": "Hochreiters 1997", "to": "Wood 2023", "width": 1}, {"from": "LeCun 1998", "to": "Krizchevsky 2012", "width": 1}, {"from": "LeCun 1998", "to": "Simonyan 2014", "width": 1}, {"from": "LeCun 1998", "to": "Goodfellow 2014", "width": 1}, {"from": "LeCun 1998", "to": "Szgedy 2015", "width": 1}, {"from": "LeCun 1998", "to": "He 2016", "width": 1}, {"from": "LeCun 1998", "to": "Vaswani 2017", "width": 1}, {"from": "LeCun 1998", "to": "Song 2020", "width": 1}, {"from": "LeCun 1998", "to": "Ho 2020", "width": 1}, {"from": "LeCun 1998", "to": "He 2023", "width": 1}, {"from": "LeCun 1998", "to": "Wood 2023", "width": 1}, {"from": "Krizchevsky 2012", "to": "Simonyan 2014", "width": 1}, {"from": "Krizchevsky 2012", "to": "Goodfellow 2014", "width": 1}, {"from": "Krizchevsky 2012", "to": "Szgedy 2015", "width": 1}, {"from": "Krizchevsky 2012", "to": "He 2016", "width": 1}, {"from": "Krizchevsky 2012", "to": "Vaswani 2017", "width": 1}, {"from": "Krizchevsky 2012", "to": "Song 2020", "width": 1}, {"from": "Krizchevsky 2012", "to": "Ho 2020", "width": 1}, {"from": "Krizchevsky 2012", "to": "He 2023", "width": 1}, {"from": "Simonyan 2014", "to": "Goodfellow 2014", "width": 1}, {"from": "Simonyan 2014", "to": "Szgedy 2015", "width": 1}, {"from": "Simonyan 2014", "to": "He 2016", "width": 1}, {"from": "Simonyan 2014", "to": "Vaswani 2017", "width": 1}, {"from": "Simonyan 2014", "to": "Song 2020", "width": 1}, {"from": "Simonyan 2014", "to": "Ho 2020", "width": 1}, {"from": "Simonyan 2014", "to": "He 2023", "width": 1}, {"from": "Goodfellow 2014", "to": "Szgedy 2015", "width": 1}, {"from": "Goodfellow 2014", "to": "He 2016", "width": 1}, {"from": "Goodfellow 2014", "to": "Vaswani 2017", "width": 1}, {"from": "Goodfellow 2014", "to": "Song 2020", "width": 1}, {"from": "Goodfellow 2014", "to": "Ho 2020", "width": 1}, {"from": "Goodfellow 2014", "to": "He 2023", "width": 1}, {"from": "Goodfellow 2014", "to": "Wood 2023", "width": 1}, {"from": "Szgedy 2015", "to": "He 2016", "width": 1}, {"from": "Szgedy 2015", "to": "Vaswani 2017", "width": 1}, {"from": "Szgedy 2015", "to": "Song 2020", "width": 1}, {"from": "Szgedy 2015", "to": "Ho 2020", "width": 1}, {"from": "Szgedy 2015", "to": "He 2023", "width": 1}, {"from": "Szgedy 2015", "to": "Wood 2023", "width": 1}, {"from": "He 2016", "to": "Vaswani 2017", "width": 1}, {"from": "He 2016", "to": "Song 2020", "width": 1}, {"from": "He 2016", "to": "Ho 2020", "width": 1}, {"from": "He 2016", "to": "He 2023", "width": 1}, {"from": "Vaswani 2017", "to": "Song 2020", "width": 1}, {"from": "Vaswani 2017", "to": "Ho 2020", "width": 1}, {"from": "Vaswani 2017", "to": "He 2023", "width": 1}, {"from": "Vaswani 2017", "to": "Wood 2023", "width": 1}, {"from": "Song 2020", "to": "Ho 2020", "width": 1}, {"from": "Song 2020", "to": "He 2023", "width": 1}, {"from": "Song 2020", "to": "Wood 2023", "width": 1}, {"from": "Ho 2020", "to": "He 2023", "width": 1}, {"from": "Ho 2020", "to": "Wood 2023", "width": 1}, {"from": "Bi 2019", "to": "Matyushin 2020", "width": 1}, {"from": "Bi 2019", "to": "Robinson 2021", "width": 1}, {"from": "Bi 2019", "to": "Robinson 2022", "width": 1}, {"from": "Bi 2019", "to": "Wood 2023", "width": 1}, {"from": "Matyushin 2020", "to": "Robinson 2021", "width": 1}, {"from": "Matyushin 2020", "to": "Robinson 2022", "width": 1}, {"from": "Matyushin 2020", "to": "Wood 2023", "width": 1}, {"from": "Robinson 2021", "to": "Robinson 2022", "width": 1}, {"from": "Robinson 2021", "to": "Wood 2023", "width": 1}, {"from": "Robinson 2022", "to": "Wood 2023", "width": 1}, {"from": "Zhang 2008", "to": "Khakimov 2015", "width": 1}, {"from": "Zhang 2008", "to": "Gonzalez 2014", "width": 1}, {"from": "Zhang 2008", "to": "Black 2019", "width": 1}, {"from": "Zhang 2008", "to": "Black 2017", "width": 1}, {"from": "Zhang 2008", "to": "Balog 2019", "width": 1}, {"from": "Khakimov 2015", "to": "Gonzalez 2014", "width": 1}, {"from": "Khakimov 2015", "to": "Black 2019", "width": 1}, {"from": "Khakimov 2015", "to": "Black 2017", "width": 1}, {"from": "Khakimov 2015", "to": "Balog 2019", "width": 1}, {"from": "Gonzalez 2014", "to": "Black 2019", "width": 1}, {"from": "Gonzalez 2014", "to": "Black 2017", "width": 1}, {"from": "Gonzalez 2014", "to": "Balog 2019", "width": 1}, {"from": "Balog 2010", "to": "Black 2017", "width": 1}, {"from": "Balog 2010", "to": "Black 2019", "width": 1}, {"from": "Black 2017", "to": "Black 2019", "width": 1}, {"from": "Black 2017", "to": "Wood 2023", "width": 1}, {"from": "Black 2019", "to": "Pardo 2016", "width": 1}, {"from": "Black 2019", "to": "Wood 2023", "width": 1}]);

              nodeColors = {};
              allNodes = nodes.get({ returnType: "Object" });
              for (nodeId in allNodes) {
                nodeColors[nodeId] = allNodes[nodeId].color;
              }
              allEdges = edges.get({ returnType: "Object" });
              // adding nodes and edges to the graph
              data = {nodes: nodes, edges: edges};

              var options = {
"configure": {
    "enabled": true,
    "filter": [
        "physics"
    ]
},
"edges": {
    "color": {
        "inherit": true
    },
    "smooth": {
        "enabled": true,
        "type": "dynamic"
    }
},
"interaction": {
    "dragNodes": true,
    "hideEdgesOnDrag": false,
    "hideNodesOnDrag": false
},
"physics": {
    "enabled": true,
    "stabilization": {
        "enabled": true,
        "fit": true,
        "iterations": 1000,
        "onlyDynamicEdges": false,
        "updateInterval": 50
    }
}
};   
              // if this network requires displaying the configure window,
              // put it in its div
              options.configure["container"] = document.getElementById("config");
              network = new vis.Network(container, data, options);
              return network;
          }
          drawGraph();
    </script>
</body>
</html>
`;

class Graph extends React.Component {
  componentDidMount() {
    const wrapper = document.querySelector('#d3_code');
    const range = document.createRange();
    range.setStart(wrapper, 0);
    wrapper.appendChild(
      range.createContextualFragment(html)
    );
  }

  render() {
    return (
      <div>React Snippet</div>
    )
  }
}

export default Graph;