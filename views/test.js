

<div class="container">
  <div class="row">
    <div class="col-sm-4 mb-4">
      {/* <input type="text" id="myFilter" class="form-control" onkeyup="myFunction()" placeholder="Search for card name..."> */}
    </div>
  </div>

  <div class="row" id="myProducts">

    <div class="col-md-4">
      <div class="card">

        <div class="card-header bg-dark d-sm-flex justify-content-sm-between align-items-sm-center">
          <div class=" card-title">
            <a href="#" style="color:white" class="display-inline-   block" onmouseover="this.style.color='#00e6ac'" onmouseout="this.style.color='#fff'">
       <strong>Card 1</strong>
            </a>
          </div>
        </div>
        <div class="card-body bg-light">
          0000x01
        </div>
        <div class="card-footer bg-white d-flex justify-content-between">
          <div>
            <i class="icon-arrow-right5 mr-2"></i>Card number one
          </div>
        </div>
      </div>
      <div class="card">

        <div class="card-header bg-dark d-sm-flex justify-content-sm-between align-items-sm-center">
          <div class=" card-title">
            <a href="#" style="color:white" class="display-inline-   block" onmouseover="this.style.color='#00e6ac'" onmouseout="this.style.color='#fff'">
       <strong>Card 2</strong>
            </a>
          </div>
        </div>
        <div class="card-body bg-light">
          0000x02
        </div>
        <div class="card-footer bg-white d-flex justify-content-between">
          <div>
            <i class="icon-arrow-right5 mr-2"></i>Card number two
          </div>
        </div>
      </div>
    </div>

  </div>
</div>


function myFunction() {
  var input, filter, cards, cardContainer, title, i;
  input = document.getElementById("myFilter");
  filter = input.value.toUpperCase();
  cardContainer = document.getElementById("myProducts");
  cards = cardContainer.getElementsByClassName("card");
  for (i = 0; i < cards.length; i++) {
    title = cards[i].querySelector(".card-title");
    if (title.innerText.toUpperCase().indexOf(filter) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}