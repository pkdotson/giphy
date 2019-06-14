const apikey = 'wiopv1QEmVomgnaELq1YRjomVtm0Gana';
const LIMIT = 50;
const debounce = (fn, t) => {
	let timer;
  return (data) => {
  	clearTimeout(timer);
    timer = setTimeout(()=>{
    	fn(data);
    },t)
  }
}


const Image = ({ url }) => {
	return (
  	 <div className="imgContainer">
       {url ? <img src={url}/> : "loading..." }
  	 </div>
  );
}

class Page extends React.Component {
	constructor(props) {
  	super(props);
    this.state={
    	loaded: [], 
    	images: [],
      all: [],
      text: "",
      total: 0
    }
  }
  componentDidMount() {
  	window.addEventListener("scroll", ()=>{
    	const page = document.getElementById("page");
      const loadMoreDebounce = debounce(this.loadMore, 200);
   		loadMoreDebounce(1);
    });
  }
  
  loadMore = (num ) => {
  	const { images, loaded} = this.state;
    
    if (images.length) {
      loaded.push(...images.splice(0,num));
    	const all = loaded.concat(new Array(LIMIT-loaded.length).fill(false));
    	this.setState({images, loaded, all});
    }
  }
  
  getData = () => {
		return fetch(
  		`https://api.giphy.com/v1/gifs/search?q=${this.state.text}&api_key=${apikey}&limit=${LIMIT}`,
 			{ method:'GET',}
  	)
  		.then((r)=>r.json())
    	.then(({data})=>{
      	const images = data.map((eachData)=>eachData.images.original.url);
        const loaded = images.splice(0,5);
      	const all = loaded.concat(new Array(LIMIT-loaded.length).fill(false));
      	this.setState({images, loaded, all})
       })
    	.catch((e)=>console.log('e', e))
	}
  
  search=(e)=>{
  	const getDataDebounce = debounce(this.getData, 1000);
  	this.setState({ 
    	text: e.target.value, images:[], loaded:[], all: []
    });
    getDataDebounce();
  }

  render() {	
		const { all, images } = this.state;
  	const restImages = all.slice(3, all.length).map((url, key)=><Image key={key} url={url}/>);
  	return(
        <div id="masonry">
           <input type="text" 
             value={this.state.text} 
             placeholder="search" 
             id="input" 
             onChange={this.search}
           />
           {all.length && 
              <div className="row1">
               <Image url={all[0]}/>
               <Image url={all[1]}/>
               <Image url={all[2]}/>
             </div>
           }
           { restImages }
      </div>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById("page"));
