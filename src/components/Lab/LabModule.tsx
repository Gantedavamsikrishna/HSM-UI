import React, { useEffect, useState } from "react";
import { labTestsAPI } from "../../services/api";

const LabModule: React.FC = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultText, setResultText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultView, setResultView] = useState<{
    text?: string;
    fileUrl?: string;
  } | null>(null);
  const handleViewResult = (test: any) => {
    setResultView({
      text: test.results || test.result_text || "",
      fileUrl:
        test.resultFileUrl ||
        test.result_file_url ||
        test.resultFile ||
        test.result_file ||
        "",
    });
    setShowResultModal(true);
  };

  useEffect(() => {
    fetchLabTests();
  }, []);

  const fetchLabTests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await labTestsAPI.getAll();
      setLabTests(data.labTests || data || []);
    } catch (err) {
      setError("Failed to fetch lab tests");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (test: any) => {
    setSelectedTest(test);
    setShowUploadModal(true);
    setResultFile(null);
    setResultText("");
    setUploadError("");
    setUploadSuccess("");
  };

  const handleUpload = async () => {
    if (!selectedTest) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    try {
      if (!resultFile && !resultText) {
        setUploadError("Please provide a result file or result text.");
        setUploading(false);
        return;
      }
      await labTestsAPI.updateResults(selectedTest.id, {
        results: resultText,
        resultFile: resultFile || undefined,
      });
      setUploadSuccess("Result uploaded successfully.");
      setTimeout(() => {
        setShowUploadModal(false);
        fetchLabTests();
      }, 1000);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload result");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Lab Tests</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-2 border">Test Name</th>
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Doctor</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Requested At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labTests.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No lab tests found.
                </td>
              </tr>
            ) : (
              labTests.map((test: any) => (
                <tr key={test.id}>
                  <td className="p-2 border">
                    {test.test_name || test.testName}
                  </td>
                  <td className="p-2 border">
                    {test.patient_first_name && test.patient_last_name
                      ? `${test.patient_first_name} ${test.patient_last_name}`
                      : test.patientId || test.patient_id}
                  </td>
                  <td className="p-2 border">
                    {test.doctor_first_name && test.doctor_last_name
                      ? `${test.doctor_first_name} ${test.doctor_last_name}`
                      : test.doctorId || test.doctor_id}
                  </td>
                  <td className="p-2 border">{test.status}</td>
                  <td className="p-2 border">
                    {test.created_at || test.createdAt
                      ? new Date(
                          test.created_at || test.createdAt
                        ).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                      onClick={() => handleUploadClick(test)}
                    >
                      Upload Result
                    </button>
                    <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs">
                      Update Status
                    </button>
                    <button
                      className={`px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-xs ${
                        !(
                          test.results ||
                          test.resultFile ||
                          test.result_file ||
                          test.result_text ||
                          test.result_file_url ||
                          test.resultFileUrl
                        )
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleViewResult(test)}
                      disabled={
                        !(
                          test.results ||
                          test.resultFile ||
                          test.result_file ||
                          test.result_text ||
                          test.result_file_url ||
                          test.resultFileUrl
                        )
                      }
                    >
                      Lab Results
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Upload Result Modal */}
      {/* Lab Result View Modal */}
      {showResultModal && resultView && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowResultModal(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-purple-700">
              Lab Result
            </h3>
            {resultView.text && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Result Text
                </label>
                <div className="border rounded p-2 bg-gray-50 whitespace-pre-wrap text-gray-800 text-sm">
                  {resultView.text}
                </div>
              </div>
            )}
            {resultView.fileUrl && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Result File
                </label>
                <a
                  href={resultView.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download/View File
                </a>
              </div>
            )}
            {!(resultView.text || resultView.fileUrl) && (
              <div className="text-gray-500">No result available.</div>
            )}
          </div>
        </div>
      )}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowUploadModal(false)}
              disabled={uploading}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-blue-700">
              Upload Lab Result
            </h3>
            {uploadError && (
              <div className="text-red-600 mb-2">{uploadError}</div>
            )}
            {uploadSuccess && (
              <div className="text-green-600 mb-2">{uploadSuccess}</div>
            )}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Result Text
              </label>
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
                disabled={uploading}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Result File (PDF/Image)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
                onChange={(e) =>
                  setResultFile(e.target.files ? e.target.files[0] : null)
                }
                disabled={uploading}
              />
            </div>
            <button
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold mt-2"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Result"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabModule;
