// Générateur CV style futuriste cohérent avec le portfolio
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Link
} from '@react-pdf/renderer';

// Styles futuristes cohérents avec le portfolio
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#0F0F23', // Dark background like portfolio
    fontFamily: 'Helvetica',
  },
  
  // Sidebar futuriste avec gradient purple
  sidebar: {
    width: '38%',
    backgroundColor: '#8B5CF6', // Purple gradient fallback
    color: '#ffffff',
    padding: 30,
    paddingTop: 40,
    position: 'relative',
  },
  
  // Formes géométriques décoratives
  sidebarDecoration: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'rotate(45deg)',
  },
  
  // Photo de profil avec forme géométrique
  profileSection: {
    alignItems: 'center',
    marginBottom: 35,
    position: 'relative',
  },
  profileFrame: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Nom et titre avec style futuriste
  sidebarName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sidebarTitle: {
    fontSize: 14,
    color: '#E0E7FF', // indigo-200
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'normal',
    letterSpacing: 1,
  },
  
  // Sections de la sidebar avec style tech
  sidebarSection: {
    marginBottom: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sidebarSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  
  // Contact avec icônes stylisées
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 8,
  },
  contactIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#FDE047', // yellow-300
    borderRadius: 6,
    marginRight: 12,
  },
  contactText: {
    fontSize: 11,
    color: '#F1F5F9', // slate-100
    flex: 1,
  },
  contactLink: {
    color: '#FDE047',
    textDecoration: 'none',
  },
  
  // Compétences avec barres futuristes
  skillItem: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  skillLevel: {
    fontSize: 10,
    color: '#1E293B',
    backgroundColor: '#FDE047',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  skillBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    backgroundColor: '#FDE047',
    borderRadius: 5,
  },
  
  // Section principale avec design tech
  mainContent: {
    width: '62%',
    backgroundColor: '#F8FAFC', // slate-50
    padding: 40,
    paddingTop: 50,
    position: 'relative',
  },
  
  // Décoration géométrique pour le main content
  mainDecoration: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
    backgroundColor: '#8B5CF6',
    opacity: 0.1,
    transform: 'rotate(45deg)',
  },
  
  // Header du main content
  mainHeader: {
    marginBottom: 40,
    position: 'relative',
  },
  mainName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E293B', // slate-800
    marginBottom: 8,
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 18,
    color: '#8B5CF6', // purple-500
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  titleAccent: {
    width: 60,
    height: 4,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    marginBottom: 20,
  },
  
  // Sections principales avec style moderne
  mainSection: {
    marginBottom: 40,
  },
  mainSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#8B5CF6',
    position: 'relative',
  },
  
  // Profil avec design card
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#8B5CF6',
    marginBottom: 30,
  },
  profileText: {
    fontSize: 12,
    color: '#475569', // slate-600
    lineHeight: 1.7,
    textAlign: 'justify',
  },
  
  // Expériences avec timeline futuriste
  experienceItem: {
    marginBottom: 30,
    paddingLeft: 25,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  experienceMarker: {
    position: 'absolute',
    left: -10,
    top: 25,
    width: 16,
    height: 16,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  experienceLeft: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
  },
  experienceCompany: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  experienceLocation: {
    fontSize: 11,
    color: '#64748B', // slate-500
    fontStyle: 'italic',
  },
  experienceDate: {
    fontSize: 11,
    color: '#ffffff',
    backgroundColor: '#8B5CF6',
    padding: '8 16',
    borderRadius: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    minWidth: 100,
  },
  experienceDescription: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 12,
    textAlign: 'justify',
  },
  
  // Projets avec cards futuristes
  projectItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  projectAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '100%',
    backgroundColor: '#06B6D4', // cyan-500
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  projectContent: {
    paddingLeft: 25,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
    flex: 1,
  },
  projectStatus: {
    fontSize: 9,
    color: '#ffffff',
    backgroundColor: '#10B981', // emerald-500
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 15,
    textAlign: 'justify',
  },
  projectTechContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectTech: {
    fontSize: 10,
    color: '#8B5CF6',
    backgroundColor: '#F3F4F6', // gray-100
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    fontWeight: '500',
  },
  
  // Footer futuriste
  footer: {
    marginTop: 'auto',
    paddingTop: 25,
    borderTopWidth: 2,
    borderTopColor: '#8B5CF6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#64748B',
  },
  generatedBadge: {
    backgroundColor: '#8B5CF6',
    padding: '6 12',
    borderRadius: 15,
  },
  generatedText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  // Liens avec style
  link: {
    color: '#8B5CF6',
    textDecoration: 'none',
  },
});

const CVGeneratorPortfolio = ({ cvData, language = 'fr', translations }) => {
  const {
    personalInfo,
    experiences,
    skills,
    projects,
    education,
    languages,
    achievements
  } = cvData;

  // Fonction helper pour obtenir les traductions
  const t = (key, fallback = key) => {
    if (!translations) return fallback;
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }
    return typeof value === 'string' ? value : fallback;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar futuriste avec gradient purple */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarDecoration} />
          
          {/* Photo de profil avec forme géométrique */}
          <View style={styles.profileSection}>
            <View style={styles.profileFrame}>
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>PHOTO</Text>
              </View>
            </View>
            
            <Text style={styles.sidebarName}>{personalInfo?.name || 'Nom'}</Text>
            <Text style={styles.sidebarTitle}>{personalInfo?.title || 'Titre Professionnel'}</Text>
          </View>

          {/* About Me / Profil */}
          {personalInfo?.summary && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>About Me</Text>
              <Text style={[styles.contactText, { lineHeight: 1.6, textAlign: 'justify' }]}>
                {personalInfo.summary.substring(0, 200)}...
              </Text>
            </View>
          )}

          {/* Compétences principales */}
          {skills && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>My Skills</Text>
              {skills.filter(skill => skill.level >= 4).slice(0, 6).map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <View style={styles.skillHeader}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillLevel}>{skill.level}/5</Text>
                  </View>
                  <View style={styles.skillBar}>
                    <View style={[styles.skillProgress, { 
                      width: `${(skill.level / 5) * 100}%` 
                    }]} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>
            
            {personalInfo?.email && (
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Link src={`mailto:${personalInfo.email}`} style={[styles.contactText, styles.contactLink]}>
                  {personalInfo.email}
                </Link>
              </View>
            )}
            
            {personalInfo?.phone && (
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Text style={styles.contactText}>{personalInfo.phone}</Text>
              </View>
            )}
            
            {personalInfo?.website && (
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Link src={personalInfo.website} style={[styles.contactText, styles.contactLink]}>
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </Link>
              </View>
            )}
          </View>
        </View>

        {/* Contenu principal */}
        <View style={styles.mainContent}>
          <View style={styles.mainDecoration} />
          
          {/* Header principal */}
          <View style={styles.mainHeader}>
            <Text style={styles.mainName}>{personalInfo?.name || 'Nom'}</Text>
            <Text style={styles.mainTitle}>{personalInfo?.title || 'Titre Professionnel'}</Text>
            <View style={styles.titleAccent} />
          </View>

          {/* Expérience professionnelle */}
          {experiences && experiences.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Experience</Text>
              {experiences.slice(0, 4).map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceMarker} />
                  <View style={styles.experienceHeader}>
                    <View style={styles.experienceLeft}>
                      <Text style={styles.experienceTitle}>{exp.title}</Text>
                      <Text style={styles.experienceCompany}>{exp.company}</Text>
                      {exp.location && (
                        <Text style={styles.experienceLocation}>{exp.location}</Text>
                      )}
                    </View>
                    <Text style={styles.experienceDate}>
                      {new Date(exp.start_date).toLocaleDateString('fr-FR', { 
                        month: 'short', 
                        year: 'numeric' 
                      })} - {exp.current ? 'Présent' : 
                        new Date(exp.end_date).toLocaleDateString('fr-FR', { 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      }
                    </Text>
                  </View>
                  {exp.description && (
                    <Text style={styles.experienceDescription}>{exp.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Formation */}
          {education && education.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Education</Text>
              {education.map((edu, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceMarker} />
                  <View style={styles.experienceHeader}>
                    <View style={styles.experienceLeft}>
                      <Text style={styles.experienceTitle}>{edu.title}</Text>
                      <Text style={styles.experienceCompany}>{edu.company || edu.institution}</Text>
                    </View>
                    <Text style={styles.experienceDate}>
                      {new Date(edu.start_date).getFullYear()}
                      {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                    </Text>
                  </View>
                  {edu.description && (
                    <Text style={styles.experienceDescription}>{edu.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projets */}
          {projects && projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Projects</Text>
              {projects.slice(0, 3).map((project, index) => (
                <View key={index} style={styles.projectItem}>
                  <View style={styles.projectAccent} />
                  <View style={styles.projectContent}>
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectTitle}>{project.title}</Text>
                      <Text style={styles.projectStatus}>{project.status || 'Completed'}</Text>
                    </View>
                    <Text style={styles.projectDescription}>{project.description}</Text>
                    {(project.technologies || project.tags) && (
                      <View style={styles.projectTechContainer}>
                        {(project.technologies || project.tags)?.slice(0, 5).map((tech, i) => (
                          <Text key={i} style={styles.projectTech}>{tech}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              CV généré automatiquement • {new Date().toLocaleDateString('fr-FR')}
            </Text>
            <View style={styles.generatedBadge}>
              <Text style={styles.generatedText}>
                ⚡ Portfolio Tech
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVGeneratorPortfolio;