// AI Career Simulator Component
// Visual career trajectory generator with animated timeline

const CareerSimulatorComponent = {
    currentProfile: null,
    careerPaths: [],

    init() {
        this.injectStyles();
        console.log('🚀 Career Simulator initialized');
    },

    render() {
        const container = document.getElementById('simulator-section');
        if (!container) return;

        container.innerHTML = `
            <div class="career-simulator">
                <div class="simulator-header">
                    <h2>🚀 AI Career Simulator</h2>
                    <p class="simulator-subtitle">Visualize your future career trajectory</p>
                </div>

                <div class="profile-input" id="profile-input">
                    <h3>📝 Enter Your Profile</h3>
                    <form id="career-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>KCET Rank</label>
                                <input type="number" id="sim-rank" placeholder="e.g., 15000" required>
                            </div>
                            <div class="form-group">
                                <label>Category</label>
                                <select id="sim-category" required>
                                    <option value="GM">General Merit</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Preferred Branch</label>
                                <select id="sim-branch" required>
                                    <option value="CSE">Computer Science</option>
                                    <option value="ECE">Electronics & Communication</option>
                                    <option value="ME">Mechanical Engineering</option>
                                    <option value="CE">Civil Engineering</option>
                                    <option value="EEE">Electrical Engineering</option>
                                    <option value="ISE">Information Science</option>
                                    <option value="AIML">AI & Machine Learning</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Interest Area</label>
                                <select id="sim-interest" required>
                                    <option value="software">Software Development</option>
                                    <option value="data">Data Science</option>
                                    <option value="core">Core Engineering</option>
                                    <option value="research">Research & Academia</option>
                                    <option value="startup">Entrepreneurship</option>
                                    <option value="government">Government Jobs</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="simulate-btn">
                            ✨ Generate Career Paths
                        </button>
                    </form>
                </div>

                <div class="simulation-results" id="simulation-results" style="display: none;">
                    <div class="results-header">
                        <h3>🎯 Your Career Trajectories</h3>
                        <button class="edit-profile-btn" id="edit-profile">✏️ Edit Profile</button>
                    </div>

                    <div class="path-selector" id="path-selector">
                        <!-- Path buttons will be added here -->
                    </div>

                    <div class="timeline-container" id="timeline-container">
                        <!-- Timeline will be rendered here -->
                    </div>

                    <div class="career-comparison" id="career-comparison">
                        <!-- Comparison chart will be rendered here -->
                    </div>

                    <div class="career-stats" id="career-stats">
                        <!-- Stats cards will be rendered here -->
                    </div>

                    <div class="career-actions">
                        <button class="action-btn primary" id="download-path">
                            📥 Download Career Plan
                        </button>
                        <button class="action-btn secondary" id="share-path">
                            📤 Share with Family
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    },

    setupEventListeners() {
        const form = document.getElementById('career-form');
        const editBtn = document.getElementById('edit-profile');
        const downloadBtn = document.getElementById('download-path');
        const shareBtn = document.getElementById('share-path');

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateCareerPaths();
        });

        editBtn?.addEventListener('click', () => {
            document.getElementById('profile-input').style.display = 'block';
            document.getElementById('simulation-results').style.display = 'none';
        });

        downloadBtn?.addEventListener('click', () => this.downloadCareerPlan());
        shareBtn?.addEventListener('click', () => this.shareCareerPlan());
    },

    async generateCareerPaths() {
        const rank = parseInt(document.getElementById('sim-rank').value);
        const category = document.getElementById('sim-category').value;
        const branch = document.getElementById('sim-branch').value;
        const interest = document.getElementById('sim-interest').value;

        this.currentProfile = { rank, category, branch, interest };

        // Generate 3 career paths
        this.careerPaths = this.generatePaths(this.currentProfile);

        // Show results
        document.getElementById('profile-input').style.display = 'none';
        document.getElementById('simulation-results').style.display = 'block';

        // Render path selector
        this.renderPathSelector();

        // Render first path timeline
        this.renderTimeline(0);

        // Render comparison chart
        this.renderComparison();

        // Render stats
        this.renderStats();

        // Award XP
        if (window.ProgressComponent) {
            ProgressComponent.addXP(25, 'career_simulation');
        }
    },

    generatePaths(profile) {
        const paths = {
            software: [
                {
                    name: '💻 Tech Giant Path',
                    description: 'Join top tech companies like Google, Microsoft, Amazon',
                    color: '#4285f4',
                    milestones: [
                        { year: 2024, title: 'College Admission', desc: 'RVCE/BMSCE CSE', salary: null, icon: '🎓' },
                        { year: 2025, title: 'Internship', desc: 'Summer internship at startup', salary: '₹30K/month', icon: '💼' },
                        { year: 2027, title: 'Campus Placement', desc: 'Product-based company', salary: '₹12 LPA', icon: '🎯' },
                        { year: 2028, title: 'Graduation', desc: 'B.E. Computer Science', salary: null, icon: '🎓' },
                        { year: 2030, title: 'Senior Engineer', desc: 'Promoted at Google', salary: '₹32 LPA', icon: '⭐' },
                        { year: 2033, title: 'Tech Lead', desc: 'Leading team of 8', salary: '₹55 LPA', icon: '👑' },
                        { year: 2038, title: 'Engineering Manager', desc: 'Managing product division', salary: '₹1.2 Cr', icon: '🚀' }
                    ],
                    probability: 35
                },
                {
                    name: '🚀 Startup Path',
                    description: 'Build your own company or join early-stage startups',
                    color: '#10b981',
                    milestones: [
                        { year: 2024, title: 'College + Hackathons', desc: 'Win SIH, build projects', salary: null, icon: '🎓' },
                        { year: 2026, title: 'Co-found Startup', desc: 'EdTech startup with friends', salary: '₹0 (Equity)', icon: '💡' },
                        { year: 2028, title: 'Seed Funding', desc: 'Raised ₹50L', salary: '₹6 LPA', icon: '💰' },
                        { year: 2030, title: 'Series A', desc: 'Raised ₹5 Cr', salary: '₹18 LPA', icon: '📈' },
                        { year: 2033, title: 'Scale', desc: '50 employees', salary: '₹35 LPA', icon: '⚡' },
                        { year: 2038, title: 'Exit/IPO', desc: 'Company valued at ₹200 Cr', salary: '₹5+ Cr', icon: '🎉' }
                    ],
                    probability: 15
                },
                {
                    name: '🌍 Global Path',
                    description: 'MS in USA, work abroad, settle internationally',
                    color: '#8b5cf6',
                    milestones: [
                        { year: 2024, title: 'College Admission', desc: 'Top NIE/RVCE', salary: null, icon: '🎓' },
                        { year: 2027, title: 'GRE + Applications', desc: 'GRE 325+, Apply to US', salary: null, icon: '📝' },
                        { year: 2028, title: 'MS in USA', desc: 'Carnegie Mellon CS', salary: '-$50K (Loan)', icon: '🇺🇸' },
                        { year: 2030, title: 'Job in USA', desc: 'FAANG company', salary: '$150K', icon: '💵' },
                        { year: 2033, title: 'Senior Engineer', desc: 'L5 at Google US', salary: '$250K', icon: '⭐' },
                        { year: 2038, title: 'Staff Engineer', desc: 'Lead architect', salary: '$450K', icon: '👑' }
                    ],
                    probability: 25
                }
            ],
            data: [
                {
                    name: '📊 Data Science Path',
                    description: 'Become a Data Scientist at top companies',
                    color: '#f59e0b',
                    milestones: [
                        { year: 2024, title: 'College + ML Focus', desc: 'Projects in AI/ML', salary: null, icon: '🎓' },
                        { year: 2026, title: 'Kaggle Expert', desc: 'Win competitions', salary: null, icon: '🏆' },
                        { year: 2028, title: 'Data Analyst', desc: 'Entry role', salary: '₹8 LPA', icon: '📊' },
                        { year: 2030, title: 'Data Scientist', desc: 'ML at fintech', salary: '₹20 LPA', icon: '🧠' },
                        { year: 2033, title: 'Senior DS', desc: 'Lead ML team', salary: '₹45 LPA', icon: '⭐' },
                        { year: 2038, title: 'Director of AI', desc: 'AI strategy head', salary: '₹1 Cr', icon: '👑' }
                    ],
                    probability: 30
                }
            ],
            government: [
                {
                    name: '🏛️ Government Path',
                    description: 'Secure government job with stability',
                    color: '#ef4444',
                    milestones: [
                        { year: 2024, title: 'College Admission', desc: 'Government engineering college', salary: null, icon: '🎓' },
                        { year: 2027, title: 'GATE Prep', desc: 'Score 600+ in GATE', salary: null, icon: '📚' },
                        { year: 2028, title: 'PSU Job', desc: 'BHEL/ISRO/DRDO', salary: '₹8 LPA', icon: '🏢' },
                        { year: 2033, title: 'Promotion', desc: 'Senior Engineer', salary: '₹15 LPA', icon: '⭐' },
                        { year: 2038, title: 'Manager', desc: 'Project Manager', salary: '₹25 LPA', icon: '👔' },
                        { year: 2048, title: 'Retirement', desc: 'Full pension benefits', salary: '₹15 LPA pension', icon: '🏖️' }
                    ],
                    probability: 50
                }
            ]
        };

        // Select paths based on interest
        let selectedPaths = paths[profile.interest] || paths.software;

        // Ensure we have 3 paths
        if (selectedPaths.length < 3) {
            selectedPaths = [...selectedPaths, ...paths.software.slice(0, 3 - selectedPaths.length)];
        }

        return selectedPaths.slice(0, 3);
    },

    renderPathSelector() {
        const container = document.getElementById('path-selector');
        container.innerHTML = this.careerPaths.map((path, idx) => `
            <button class="path-btn ${idx === 0 ? 'active' : ''}" 
                    data-index="${idx}"
                    style="--path-color: ${path.color}">
                <span class="path-name">${path.name}</span>
                <span class="path-prob">${path.probability}% likely</span>
            </button>
        `).join('');

        container.querySelectorAll('.path-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                container.querySelectorAll('.path-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderTimeline(parseInt(btn.dataset.index));
            });
        });
    },

    renderTimeline(pathIndex) {
        const path = this.careerPaths[pathIndex];
        const container = document.getElementById('timeline-container');

        container.innerHTML = `
            <div class="timeline" style="--path-color: ${path.color}">
                <div class="timeline-line"></div>
                ${path.milestones.map((m, idx) => `
                    <div class="timeline-item" style="animation-delay: ${idx * 0.2}s">
                        <div class="timeline-dot">${m.icon}</div>
                        <div class="timeline-content">
                            <div class="timeline-year">${m.year}</div>
                            <div class="timeline-title">${m.title}</div>
                            <div class="timeline-desc">${m.desc}</div>
                            ${m.salary ? `<div class="timeline-salary">${m.salary}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="path-description">
                <p>${path.description}</p>
            </div>
        `;
    },

    renderComparison() {
        const container = document.getElementById('career-comparison');

        // Calculate max salary for scaling
        const maxSalary = Math.max(...this.careerPaths.flatMap(p =>
            p.milestones.filter(m => m.salary).map(m => this.parseSalary(m.salary))
        ));

        container.innerHTML = `
            <h4>💰 Salary Comparison (10 Year Projection)</h4>
            <div class="comparison-chart">
                ${this.careerPaths.map((path, idx) => {
            const finalSalary = path.milestones.filter(m => m.salary).pop();
            const salaryValue = finalSalary ? this.parseSalary(finalSalary.salary) : 0;
            const percentage = (salaryValue / maxSalary) * 100;

            return `
                        <div class="comparison-bar" style="animation-delay: ${idx * 0.3}s">
                            <div class="bar-label">${path.name.split(' ')[0]}</div>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: ${percentage}%; background: ${path.color}"></div>
                            </div>
                            <div class="bar-value">${finalSalary?.salary || 'N/A'}</div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    parseSalary(salaryStr) {
        if (!salaryStr) return 0;
        const num = salaryStr.replace(/[^0-9.]/g, '');
        if (salaryStr.includes('Cr')) return parseFloat(num) * 100;
        if (salaryStr.includes('LPA')) return parseFloat(num);
        if (salaryStr.includes('$')) return parseFloat(num) * 0.8; // USD to INR approximation
        if (salaryStr.includes('K')) return parseFloat(num) * 0.12; // Monthly to annual
        return parseFloat(num) || 0;
    },

    renderStats() {
        const container = document.getElementById('career-stats');
        const currentPath = this.careerPaths[0];

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">₹${this.calculateTotalEarnings(currentPath)}</div>
                    <div class="stat-label">15-Year Earnings</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${currentPath.milestones.length}</div>
                    <div class="stat-label">Career Milestones</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${currentPath.probability}%</div>
                    <div class="stat-label">Success Probability</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">4-5 yrs</div>
                    <div class="stat-label">Time to First Job</div>
                </div>
            </div>
        `;
    },

    calculateTotalEarnings(path) {
        let total = 0;
        path.milestones.forEach((m, idx) => {
            if (m.salary) {
                const salary = this.parseSalary(m.salary);
                const years = idx < path.milestones.length - 1
                    ? path.milestones[idx + 1].year - m.year
                    : 5;
                total += salary * years;
            }
        });
        return total > 100 ? `${(total / 100).toFixed(1)} Cr` : `${total.toFixed(0)} L`;
    },

    downloadCareerPlan() {
        const path = this.careerPaths[0];
        let text = `CAREER PLAN - ${path.name}\n`;
        text += `${'='.repeat(40)}\n\n`;
        text += `${path.description}\n\n`;
        text += `MILESTONES:\n`;

        path.milestones.forEach(m => {
            text += `\n${m.year} - ${m.title}\n`;
            text += `   ${m.desc}\n`;
            if (m.salary) text += `   Salary: ${m.salary}\n`;
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'career_plan.txt';
        a.click();
        URL.revokeObjectURL(url);
    },

    shareCareerPlan() {
        const path = this.careerPaths[0];
        const text = `Check out my career plan with InsightRural! 🚀\n\n` +
            `${path.name}\n${path.description}\n\n` +
            `Generated at InsightRural - AI Educational Guide`;

        if (navigator.share) {
            navigator.share({ title: 'My Career Plan', text });
        } else {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, '_blank');
        }
    },

    injectStyles() {
        if (document.getElementById('career-simulator-styles')) return;

        const style = document.createElement('style');
        style.id = 'career-simulator-styles';
        style.textContent = `
            .career-simulator {
                padding: 1.5rem;
                max-width: 800px;
                margin: 0 auto;
            }

            .simulator-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .simulator-header h2 {
                font-size: 1.8rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .profile-input {
                background: var(--card-bg, #1a1a2e);
                border-radius: 16px;
                padding: 1.5rem;
            }

            .profile-input h3 {
                margin-bottom: 1.5rem;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--text-secondary, #888);
                font-size: 0.9rem;
            }

            .form-group input,
            .form-group select {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid var(--border-color, #333);
                border-radius: 8px;
                background: var(--bg-color, #0a0a0f);
                color: var(--text-primary, #fff);
                font-size: 1rem;
            }

            .simulate-btn {
                width: 100%;
                padding: 1rem;
                margin-top: 1rem;
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .simulate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
            }

            .results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .edit-profile-btn {
                padding: 0.5rem 1rem;
                background: transparent;
                border: 1px solid var(--border-color, #333);
                border-radius: 8px;
                color: var(--text-primary, #fff);
                cursor: pointer;
            }

            .path-selector {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }

            .path-btn {
                flex: 1;
                min-width: 200px;
                padding: 1rem;
                background: var(--card-bg, #1a1a2e);
                border: 2px solid var(--border-color, #333);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            }

            .path-btn.active {
                border-color: var(--path-color);
                background: linear-gradient(135deg, var(--path-color)22 0%, transparent 100%);
            }

            .path-name {
                display: block;
                font-weight: 600;
                color: var(--text-primary, #fff);
                margin-bottom: 0.25rem;
            }

            .path-prob {
                font-size: 0.8rem;
                color: var(--text-secondary, #888);
            }

            .timeline-container {
                margin-bottom: 2rem;
            }

            .timeline {
                position: relative;
                padding-left: 30px;
            }

            .timeline-line {
                position: absolute;
                left: 12px;
                top: 0;
                bottom: 0;
                width: 3px;
                background: linear-gradient(to bottom, var(--path-color), transparent);
            }

            .timeline-item {
                position: relative;
                margin-bottom: 1.5rem;
                opacity: 0;
                animation: fadeInSlide 0.5s forwards;
            }

            @keyframes fadeInSlide {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            .timeline-dot {
                position: absolute;
                left: -30px;
                width: 28px;
                height: 28px;
                background: var(--card-bg, #1a1a2e);
                border: 3px solid var(--path-color);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }

            .timeline-content {
                background: var(--card-bg, #1a1a2e);
                border: 1px solid var(--border-color, #333);
                border-radius: 12px;
                padding: 1rem;
                margin-left: 10px;
            }

            .timeline-year {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                background: var(--path-color);
                color: white;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }

            .timeline-title {
                font-weight: 600;
                color: var(--text-primary, #fff);
                margin-bottom: 0.25rem;
            }

            .timeline-desc {
                color: var(--text-secondary, #888);
                font-size: 0.9rem;
            }

            .timeline-salary {
                margin-top: 0.5rem;
                padding: 0.25rem 0.5rem;
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                border-radius: 4px;
                font-size: 0.85rem;
                font-weight: 500;
                display: inline-block;
            }

            .path-description {
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(139, 92, 246, 0.1);
                border-radius: 8px;
                color: var(--text-primary, #fff);
            }

            .career-comparison {
                margin-bottom: 2rem;
            }

            .career-comparison h4 {
                margin-bottom: 1rem;
                color: var(--text-secondary, #888);
            }

            .comparison-chart {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .comparison-bar {
                display: grid;
                grid-template-columns: 80px 1fr 100px;
                align-items: center;
                gap: 1rem;
                opacity: 0;
                animation: fadeIn 0.5s forwards;
            }

            @keyframes fadeIn {
                to { opacity: 1; }
            }

            .bar-label {
                font-size: 0.9rem;
                color: var(--text-primary, #fff);
            }

            .bar-track {
                height: 24px;
                background: var(--card-bg, #1a1a2e);
                border-radius: 12px;
                overflow: hidden;
            }

            .bar-fill {
                height: 100%;
                border-radius: 12px;
                transition: width 1s ease-out;
            }

            .bar-value {
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--text-primary, #fff);
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .stat-card {
                background: var(--card-bg, #1a1a2e);
                border: 1px solid var(--border-color, #333);
                border-radius: 12px;
                padding: 1rem;
                text-align: center;
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .stat-label {
                font-size: 0.8rem;
                color: var(--text-secondary, #888);
                margin-top: 0.25rem;
            }

            .career-actions {
                display: flex;
                gap: 1rem;
            }

            .career-actions .action-btn {
                flex: 1;
                padding: 1rem;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .career-actions .primary {
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                color: white;
            }

            .career-actions .secondary {
                background: var(--card-bg, #1a1a2e);
                border: 1px solid var(--border-color, #333);
                color: var(--text-primary, #fff);
            }

            @media (max-width: 600px) {
                .form-row {
                    grid-template-columns: 1fr;
                }

                .path-btn {
                    min-width: 100%;
                }

                .comparison-bar {
                    grid-template-columns: 60px 1fr 80px;
                }
            }
        `;
        document.head.appendChild(style);
    },

    activate() {
        this.render();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    CareerSimulatorComponent.init();
});

// Export
window.CareerSimulatorComponent = CareerSimulatorComponent;
