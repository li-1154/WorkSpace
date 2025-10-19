export class ProductService {
  getproducts() {
    return [
      {
        imageUrl: 'https://picsum.photos/id/101/120/120',
        productName: '折叠式电动自行车',
        releasedDate: new Date(2015,1,25),
        description: '轻便可折叠设计，最高时速 25km/h，续航达 40km。非常适合通勤。',
        rating: 1,
        numOfReviews: 132
      },
      {
        imageUrl: 'https://picsum.photos/id/237/120/120',
        productName: '智能头盔 AirRide Pro',
        releasedDate: new Date(2015,1,25),
        description: '内置蓝牙与语音助手功能，可实时导航与通话，防水等级 IPX5。',
        rating: 2,
        numOfReviews: 257
      },
      {
        imageUrl: 'https://picsum.photos/id/102/120/120',
        productName: '城市骑行防盗锁',
        releasedDate: new Date(2015,1,25),
        description: '高强度合金锁芯，支持 NFC 与 App 开锁功能。',
        rating: 3,
        numOfReviews: 98
      },
      {
        imageUrl: 'https://picsum.photos/id/103/120/120',
        productName: '智能骑行记录仪',
        releasedDate: new Date(2015,1,30s),
        description: '1080P 高清录制，支持 GPS 定位与夜视功能。',
        rating: 4,
        numOfReviews: 180
      }
    ];
  }
}