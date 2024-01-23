const express = require('express');
const bodyParser = require('body-parser');
const product = require('./model/product');
const announcement = require('./model/announcement');
const map = require('./model/map')
const events = require('./model/events');
const importantInformation = require('./model/importantInfo');
const User = require('./model/user');
const login = require('./model/login')
const cors = require('cors');
const auth = require('./controller/authController')
const app = express();
const { hashSync } = require('bcrypt')
const path = require('path');
const bcrypt = require('bcrypt');
const config = require('dotenv').config();
const jwt = require('jsonwebtoken');

// Set up multer storage
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Test
app.post('/product', (req, res) => {


    var name = req.body.name
    var description = req.body.description
    var brand = req.body.brand
    var price = req.body.price

    // call the model method add module
    product.addproduct(name, description, brand, price, (err, result) => {
        if (err) {
            console.log(err)
            // respond the error
            res.status(500).send()
        } else {


            res.status(201).send(result)
        }
    })

})

app.get('/products', (req, res) => {
    product.getproduct((err, result) => {
        if (err) {
            console.log(err)
            // respond with status 500 
            res.status(500).send()
        } else {
            console.log(result)
            //respond with status 200 and send result back
            res.status(200).send(result.rows)
        }
    })
})

//Create Announcements
app.post('/announcement', (req, res) => {


    var title = req.body.title
    var description = req.body.description
    var imageid = req.body.publicId
    var eventid = req.body.event

    // call the model method add module
    announcement.addAnnouncement(title, description, imageid, eventid, (err, result) => {
        if (err) {
            console.log(err)
            // respond the error
            res.status(500).send()
        } else {
            console.log(result)

            res.status(201).send(result)
        }
    })

})

//Retrieve announcements
app.get('/announcements', (req, res) => {
    announcement.getAnnouncements((err, result) => {
        if (err) {
            console.log(err)
            // respond with status 500 
            res.status(500).send()
        } else {
            console.log(result)
            //respond with status 200 and send result back
            res.status(200).send(result.rows)
        }
    })
})


app.get('/announcements/:id', (req, res) => {
    var announcementid = parseInt(req.params.id);
    

    announcement.getAnnouncementById(announcementid, (err, result) => {
        if (err) {
            console.log(result)
            console.log(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});

app.get('/eventsannouncement', (req, res) => {

    announcement.getEventList((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})

app.get('/eventannouncements/:eventid', (req, res) => {
    
    // Use the announcement module to get announcements tied to the specified event ID
    const { eventid } = req.params;
    announcement.getAnnouncementsByEventId(eventid, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});


app.put('/announcements/:id/', (req, res) => {

    var productid = parseInt(req.params.id);
    var title = req.body.title
    var description = req.body.description
    var image = req.body.publicId
    var eventid = req.body.event



    // call the model method add module
    announcement.updateAnnouncement(productid, title, description, image,eventid, (err, result) => {
        if (err) {
            console.log(err)
            // respond the error
            res.status(500).send()
        } else {


            res.status(201).send(result)
        }
    })

})

app.delete('/announcements/:id', (req, res)=>{
    var productid = parseInt(req.params.id);

    announcement.deleteAnnouncement(productid, (err, result)=>{
        if(err){
            console.log(err)
            // respond with status 500 
            res.status(500).send()
        }else {
            console.log(result)
            //respond with status 200 and send result back
            res.status(200).send(result.rows)    
        }
    })
})
app.post('/events', (req, res) => {

    var title = req.body.title;
    var image_banner = req.body.publicId;
    var time_start = req.body.time_start;
    var time_end = req.body.time_end;
    var location = req.body.location;
    var survey_link = req.body.survey_link;
    var keynote_speaker = req.body.keynote_speaker;
    var description = req.body.description;


    events.addEvent(title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})

app.get('/events', (req, res) => {

    events.getEvents((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})

app.get('/events/:id', (req, res) => {
    var eventid = parseInt(req.params.id);
    

    events.getEventbyId(eventid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});

app.put('/events/:id', (req, res) => {
    var eventid = parseInt(req.params.id);
    var title = req.body.title
    var image_banner = req.body.publicId
    var time_start = req.body.time_start
    var time_end = req.body.time_end
    var location = req.body.location
    var keynote_speaker = req.body.keynote_speaker
    var description = req.body.description
    var survey_link = req.body.survey_link
  
    events.updateEvent(eventid, title, image_banner, time_start,time_end, location, keynote_speaker, description, survey_link ,(err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.status(200).send(result);
      }
    });
});

app.delete('/deleteevent/:id', (req, res) => {
    var eventid = parseInt(req.params.id);

    events.deleteEvent(eventid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})
app.post('/importantInformation', (req, res) => {

    var title = req.body.title
    var subtitle = req.body.subtitle
    var description = req.body.description
    var image = req.body.publicId

    importantInformation.addImportantInfomation(title, subtitle, description, image ,(err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})

app.get('/importantInformation', (req, res) => {

    importantInformation.getImportantInfomation((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})
app.get('/info/:id', (req, res) => {
    var infoid = parseInt(req.params.id);
    

    importantInformation.getImportantInformationById(infoid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});


app.put('/importantinfo/:id', (req, res) => {
    var infoid = parseInt(req.params.id);
    var title = req.body.title
    var subtitle = req.body.subtitle
    var description = req.body.description
    var image = req.body.publicId
  
    importantInformation.updateImportantInformation(infoid, title, subtitle, description,image,  (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.status(200).send(result);
      }
    });
});

app.delete('/delete/:id', (req, res) => {
    var infoid = parseInt(req.params.id);

    importantInformation.deleteImportantInformation(infoid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})

app.delete('/delete/:id', (req, res) => {
    var eventid = parseInt(req.params.id);

    events.deleteEvent(eventid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})
app.post('/marker', (req, res) => {

    var location_name = req.body.location_name
    var category = req.body.category
    var description = req.body.description
    var coordinates = req.body.coordinates
    var image = req.body.publicId

    map.addmarker(location_name, category, description, coordinates, image, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })


})

app.get('/markerindiv/:id', (req, res) => {
    var mapid = parseInt(req.params.id);
    

    map.getmarkerindiv(mapid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});

app.get('/markers', (req, res) => {

    map.getmarker((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})


app.put('/marker/:id', (req, res) => {
    var mapid = parseInt(req.params.id);
    var location_name = req.body.location_name
    var category = req.body.category
    var description = req.body.description
  
    map.updatemarker(mapid, location_name, category, description, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.status(200).send(result);
      }
    });
});

app.delete('/delmarker/:id', (req, res) => {
    var mapid = parseInt(req.params.id);

    map.deletemarker(mapid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})


app.post('/addadmin', (req, res) => {

    var username = req.body.username
    var password = req.body.password
    var type = req.body.type

    User.addadmin(username, password, type, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let message = 'Credentials are not valid.';

    try {
        login.verify(username, function(error, results) {
            console.log("resultlength",results.length)

            if (error) {
                let message = 'Credentials are not valid.';
                return res.status(500).json({ message: message });

            } else {
                if (results != null) {
                    if ((password == null) || (results == null)) {
                        return res.status(500).json({ message: 'Login failed' });
                    }
                    if (bcrypt.compareSync(password, results.password) == true) {

                        let data = {
                            user_id: results.roleid,
                            role_name: results.type,
                            token: jwt.sign({ id: results.roleid,role:results.type}, process.env.JWTKEY, {
                                expiresIn: 36000 //Expires in 10h
                            })
                        }; //End of data variable setup

                        return res.status(200).json(data);
                    } else {
                        return res.status(500).json({ message: 'Login has failed.' });
                    } //End of passowrd comparison with the retrieved decoded password.
                } //End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        return res.status(500).json({ message: message });
    } //end of try



})
app.post('/register', (req, res) => {

    console.log('processRegister running.');
    let username = req.body.username;
    let password = req.body.password;
    let type = req.body.type;

    bcrypt.hash(password, 10, async(err, hash) => {
        if (err) {
            console.log('Error on hashing password');
            return res.status(500).json({ statusMessage: 'Unable to complete registration' });
        } else {
            
                results = User.addManager(username, hash, type, function(results, error){
                  if (results!=null){
                    console.log(results);
                    return res.status(200).json({ statusMessage: 'Completed registration.' });
                  }
                  if (error) {
                    console.log('processRegister method : callback error block section is running.');
                    console.log(error, '==================================================================');
                    return res.status(500).json({ statusMessage: 'Unable to complete registration' });
                }
                });//End of anonymous callback function
     
          
        }
    });


})
app.get('/users', (req, res) => {

    User.getUsers((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})
app.get('/roles', (req, res) => {

    User.getAdmin((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})

app.post('/adduser', (req, res) => {

    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var company = req.body.company
    var uid = req.body.uid
    

    User.addUser(first_name, last_name, company, uid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})




app.get('/useruid/:uid', (req, res) => {
    var uid = req.params.uid;

    User.getUserByUid(uid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200).json(result);
        }
    });
});


app.post('/saveevent', (req, res) => {

    var uid = req.body.uid
    var eventid = req.body.eventid
 
    

    events.savevents(uid,eventid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})


app.get('/saveevents/:uid', (req, res) => {
    var uid = req.params.uid;

    events.getusersave(uid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200).json(result);
        }
    });
});

app.delete('/delevent/:uid', (req, res) => {
    var uid = req.params.uid;
    var eventid = req.body.eventid

    events.deletesaveEvent(eventid, uid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})



app.get('/testlogin', (req, res, next) => {
    //If the token is valid, the logic extracts the user id and the role information.
    //If the role is not user, then response 403 UnAuthorized
    //The user id information is inserted into the request.body.userId
        console.log('http header - user ', req.headers['user']);
        if (typeof req.headers.authorization !== "undefined") {
            // Retrieve the authorization header and parse out the
            // JWT using the split function
            let token = req.headers.authorization.split(' ')[1];
            //console.log('Check for received token from frontend : \n');
            //console.log(token);
            jwt.verify(token, process.env.JWTKey, (err, data) => {
                console.log('data extracted from token \n',data);
                if (err) {
                    console.log(err)
                    return res.status(200).json({ message: 'Unauthorized access' });
                }   
                else {
                    req.body.userId = data.id;
                    req.body.role = data.role;
                    next();
                }
            })
  
      }else{
        res.status(403).send({ message: 'Unauthorized access' });

      }
    } //End of checkForValidUserRoleUser
)





module.exports = app;

