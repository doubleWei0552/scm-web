import React from 'react';
import Lightbox from 'react-images';

export default class ImageView extends React.Component {
    state={
        url:[{ src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' }, 
        { src: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' }],
        lightboxIsOpen:true,
        currentImage: 0,
    }
    closeLightbox=()=>{
        this.setState({
            lightboxIsOpen:false
        })
    }
    gotoPrevious () {
		this.setState({
			currentImage: this.state.currentImage - 1,
		});
	}
	gotoNext () {
		this.setState({
			currentImage: this.state.currentImage + 1,
		});
	}
  render() {
    return (
        <div>
            <Lightbox
                images={this.state.url}
                isOpen={this.state.lightboxIsOpen}
                onClickPrev={this.gotoPrevious}
                onClickNext={this.gotoNext}
                onClose={this.closeLightbox}
            />
        </div>
      
    );
  }
}