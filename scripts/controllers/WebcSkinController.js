const { WebcController } = WebCardinal.controllers;

class WebcSkinController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.setModel(this.initializeModel());
    }

    initializeModel() {
        return ({
            header: {
                title: {
                    text: 'WebcSkin examples 👨‍🏫'
                },
                description: {
                    title: 'test',
                }
            },
            main: {
              items: [
                  {
                      title: 'Item 1',
                      html: `Content 1`,
                      opened: true
                  },
                  {
                      title: 'Item 2',
                      html: `Content 2`
                  },
                  {
                      title: 'Item 3',
                      html: `Content 3`
                  }
              ]
            }
        })
    }
}

export default WebcSkinController;