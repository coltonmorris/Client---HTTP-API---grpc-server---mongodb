//have no idea how to link this file to index.html (react), maybe serve from a server.
class LikeButton extends React.Component {
  constructor() {
    super();
    this.state = {
          liked: false
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({liked: !this.state.liked});
    var firstName = document.getElementById("name").value;
    $.ajax({
    	url: 'http://localhost:8080/my_post',
    	type: 'POST',
    	dataType: 'json',
    	contentType: 'application/json',
    	data: JSON.stringify({first: firstName})
    })
    .done(function(data){
	console.log(data);
    })
    .fail(function(jqXHR,textStatus){
	console.log("ERRRROR: " + textStatus);
    });
  }
  render() {
    const text = this.state.liked ? 'like' : 'haven\'t liked';
    return (
      <div>
      <input type='text' placeholder='enter your first name' id="name" />
      <br />
      <button onClick={this.handleClick}> {text} </button>
      </div>
    );
  }
}
ReactDOM.render( <LikeButton />, document.getElementById('container'));
