export default function RecentDocs() {
  return (
    <section className="section">
        <section className="section">
            <div className="section-header">
              <h3>Tài liệu học tập gần đây</h3>

              <button>Xem tất cả</button>
            </div>

            <div className="docs-grid">
              <div className="doc-card">
                <div className="doc-icon red">📕</div>

                <div>
                  <h4>Cấu trúc dữ liệu.pdf</h4>
                  <p>PDF • 2.4 MB • 2 giờ trước</p>
                </div>
              </div>

              <div className="doc-card">
                <div className="doc-icon red">📕</div>

                <div>
                  <h4>SQL cơ bản.pdf</h4>
                  <p>PDF • 1.8 MB • 1 ngày trước</p>
                </div>
              </div>

              <div className="doc-card">
                <div className="doc-icon blue">📘</div>

                <div>
                  <h4>Machine Learning.docx</h4>
                  <p>DOCX • 3.1 MB • 2 ngày trước</p>
                </div>
              </div>

              <div className="doc-card">
                <div className="doc-icon orange">📙</div>

                <div>
                  <h4>Toán rời rạc.pptx</h4>
                  <p>PPTX • 4.2 MB • 3 ngày trước</p>
                </div>
              </div>
            </div>
          </section>
    </section>
  );
}