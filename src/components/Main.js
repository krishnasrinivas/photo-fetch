require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let imgextensions = ["ani","bmp","cal","fax","gif","img","jbg","jpe","jpeg","jpg","mac","pbm","pcd","pcx","pct","pgm","png","ppm","psd","ras","tga","tiff","wmf"]

class AppComponent extends React.Component {
  constructor(props) {
    super(props)

    var minioClient = new Minio.Client({
      endPoint: '147.75.201.195',
      port: 9000,
      secure: false,
      accessKey: 'minio',
      secretKey: 'minio123'
    });

    this.state = {
      img: "http://www.kikiaolaconstruction.com/pics/rt65s.jpg",
      minioClient: minioClient
    }

  }
  componentDidMount() {
    this.state.poller = this.state.minioClient.listenBucketNotification('alice', '', '', ['s3:ObjectCreated:*'])

    this.state.poller.on('notification', record => {
      let newFile = record.s3.object.key.toLowerCase()
      console.log(newFile)
      if (imgextensions.filter(ext => {
	if (newFile.endsWith(ext)) return true
	return false
      }).length === 0) return
      this.setState({
	img: `http://147.75.201.195:9000/${record.s3.bucket.name}/${record.s3.object.key}`
      })
      console.log(record)
    })
  }
  render() {
    return (
      <div className="index">
        <img className="animate fadeInUp" src={this.state.img} alt="Yeoman Generator" />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
