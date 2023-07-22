import { Routes, Route} from 'react-router-dom'
import Home from '../pages/Home.js'
import About from '../pages/About.js'
import Contact from '../pages/Contact.js'
import StudentList from '../pages/Student.js'
import StudentCreate from '../pages/StudentCreate.js'
import StudentEdit from '../pages/StudentEdit.js'
import AddDevicePage from '../pages/AddDevicePage.js'
import ViewMatrix from '../pages/ViewMatrix.js'
import EditSensorPage from '../pages/EditSensorPage.js'
import EditSituationPage from '../pages/EditSituationPage.js'

function MyRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/about-us" element={<About/>} />
            <Route path="/contact-us" element={<Contact/>} />
            <Route path="/students" element={<StudentList/>} />
            <Route path="/students/create" element={<StudentCreate/>} />
            <Route path="/students/:id/edit" element={<StudentEdit/>} />
            <Route path="/device/:id/edit" element={<AddDevicePage/>} />
            <Route path="/sensor/edit" element={<EditSensorPage/>} />
            <Route path="/situation/edit" element={<EditSituationPage/>} />
            <Route path="/situation/matrix" element={<ViewMatrix/>} />

        </Routes>
    )
}

export default MyRouter;