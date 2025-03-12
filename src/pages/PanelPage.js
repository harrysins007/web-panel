import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./PanelPage.css";

const PanelPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(null); // State for AI analysis result
  const db = getFirestore();
  const navigate = useNavigate();

  // Helper function to format date and time
  const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const formattedDate = dateObj.toLocaleDateString("en-GB");
    const formattedTime = dateObj.toLocaleTimeString("en-GB");
    return `${formattedDate} ${formattedTime}`;
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMedia, setPopupMedia] = useState("");

  const handleViewMedia = (mediaUrl) => {
    setPopupMedia(mediaUrl);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupMedia("");
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      const complaintsCollection = collection(db, "complaints");
      const complaintsSnapshot = await getDocs(complaintsCollection);
      const complaintsList = complaintsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComplaints(complaintsList);
    };

    fetchComplaints();
  }, [db]);

  // Handle AI analysis
  const handleAiAnalysis = async () => {
    if (!selectedComplaint) return;

    try {
      const response = await fetch("http://localhost:8080/api/process-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint: selectedComplaint.description }),
      });

      const data = await response.json();
      setAiAnalysis(data); // Store AI analysis result in state
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
    }
  };

  const filteredComplaints = complaints
    .filter((complaint) => {
      if (statusFilter !== "all" && complaint.status?.statusText !== statusFilter) {
        return false;
      }
      if (dateFilter && complaint.dateFiled !== dateFilter) {
        return false;
      }
      if (searchQuery && !complaint.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.dateFiled) - new Date(a.dateFiled)); // Sort by most recent first

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setAiAnalysis(null); // Clear AI analysis when new complaint is selected
  };

  return (
    <div className="panel-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li onClick={() => navigate("/investigation")}>Investigation</li>
          <li onClick={() => navigate("/complaint-history")}>Complaint History</li>
          <li onClick={() => navigate("/manage-employees")}>Manage Employees</li>
          <li onClick={() => navigate("/chat")}>Chat</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="filters">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Resolved">Resolved</option>
          </select>
          <label>Date:</label>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="content-wrapper">
          {/* Complaints List */}
          <div className="complaints-list">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="complaint-item"
                onClick={() => handleComplaintClick(complaint)}
              >
                <p><strong>{complaint.id}</strong></p>
                <p>{complaint.title}</p>
                <p><strong>Filed on:</strong> {formatDateTime(complaint.dateFiled)}</p>
              </div>
            ))}
          </div>

          {isPopupVisible && (
            <div className="media-popup-overlay" onClick={closePopup}>
              <div className="media-popup" onClick={(e) => e.stopPropagation()}>
                <span className="close-btn" onClick={closePopup}>
                  &times;
                </span>
                <img src={popupMedia} alt="Complaint Media" />
              </div>
            </div>
          )}

          {/* Complaint Details / AI Analysis */}
          {selectedComplaint && !aiAnalysis && (
            <div className="complaint-details">
              <div className="details-header">
                <h2>{selectedComplaint.title}</h2>
                <p className="date-filed">
                  <strong>Filed on:</strong> {formatDateTime(selectedComplaint.dateFiled)}
                </p>
              </div>
              <p><strong>Complaint:</strong> {selectedComplaint.description}</p>
              <p><strong>Culprits:</strong> {selectedComplaint.culprits}</p>
              <p><strong>Department:</strong> {selectedComplaint.department ?? "null"}</p>
              <p><strong>Date of Occurrence:</strong> {selectedComplaint.dateOfOccurrence}</p>
              <p><strong>Time of Occurrence:</strong> {selectedComplaint.timeOfOccurrence}</p>
              <button onClick={() => handleViewMedia(selectedComplaint.media)}>
                View Media
              </button>
              <div className="actions">
                <button onClick={handleAiAnalysis}>AI Analysis</button>
                <button onClick={() => alert("Sending to Chat...")}>Send to Chat</button>
              </div>
            </div>
          )}

          {/* AI Analysis Report */}
          {aiAnalysis && (
            <div className="ai-analysis-container">
              <h3>AI Analysis Report</h3>
              <p><strong>Complaint :</strong> {selectedComplaint.description}</p>
              <p><strong>Category :</strong> {aiAnalysis.category}</p>
              <p><strong>Intensity :</strong> {aiAnalysis.intensity}</p>
              <p><strong>Suggested Solution :</strong> {aiAnalysis.solution}</p>
              <div className="actions">
                <button>Save as Resolved</button>
                <button>Modify</button>
                <button>Generate AI Letter</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelPage;
