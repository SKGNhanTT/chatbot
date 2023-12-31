import request from 'request';
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let callSendAPI = async (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },

        message: response,
    };

    await senddMarkSeen(sender_psid);
    await sendTypingOn(sender_psid);
    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log('message sent!');
            } else {
                console.error('Unable to send message:' + err);
            }
        }
    );
};

let sendTypingOn = (sender_psid) => {
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        sender_action: 'typing_on',
    };
    request(
        {
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log('typing on');
            } else {
                console.error('Unable to send message:' + err);
            }
        }
    );
};

let senddMarkSeen = (sender_psid) => {
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        sender_action: 'mark_seen',
    };
    request(
        {
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log('mark seen');
            } else {
                console.error('Unable to send message:' + err);
            }
        }
    );
};

let getUserName = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        request(
            {
                uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
                qs: { access_token: PAGE_ACCESS_TOKEN },
                method: 'GET',
            },
            (err, res, body) => {
                if (!err) {
                    let response = JSON.parse(body);
                    let username = `${response.first_name} ${response.last_name}`;
                    resolve(username);
                } else {
                    console.error('Unable to send message:' + err);
                    reject(err);
                }
            }
        );
    });
};

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response = {
                text: `Hello ${username}, Welcome to Booking Health Care!`,
            };
            let response2 = getStartedTemplate();

            callSendAPI(sender_psid, response);
            callSendAPI(sender_psid, response2);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    });
};

let getStartedTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'What can I do for you?',
                        subtitle: 'Here is the guide on how to use.',
                        image_url:
                            'https://cdn.bookingcare.vn/fo/2023/11/02/134537-group-12314.png',
                        buttons: [
                            {
                                type: 'postback',
                                title: 'Schedule an Examination',
                                payload: 'BOOKING',
                            },
                            {
                                type: 'postback',
                                title: 'View specialities',
                                payload: 'VIEW_SPECIALITIES',
                            },
                            {
                                type: 'postback',
                                title: 'View doctors',
                                payload: 'VIEW_DOCTORS',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let handleGetSpecialties = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = getMainMenuTemplete();
            callSendAPI(sender_psid, response);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    });
};

let getMainMenuTemplete = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-cot-song.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                    {
                        title: 'Danh sách các chuyên khoa',
                        subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                        image_url:
                            'https://raw.githubusercontent.com/SKGNhanTT/image/master/image/113208-y-hoc-co-truyen.jpg',
                        buttons: [
                            {
                                type: 'web_url',
                                title: 'Chuyên khoa 1',
                                url: 'https://www.facebook.com/profile.php?id=61554766091107',
                                webview_height_ratio: 'full',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

module.exports = {
    handleGetStarted: handleGetStarted,
    handleGetSpecialties: handleGetSpecialties,
};
