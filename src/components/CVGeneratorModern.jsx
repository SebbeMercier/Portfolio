// Générateur CV style moderne avec sidebar sombre
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Link,
  Image
} from '@react-pdf/renderer';

// Styles inspirés du design moderne avec sidebar
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  
  // Sidebar sombre à gauche
  sidebar: {
    width: '35%',
    backgroundColor: '#2D3748', // gray-800
    color: '#ffffff',
    padding: 40,
    paddingTop: 60,
  },
  
  // Photo de profil (placeholder)
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#4A5568', // gray-600
    borderRadius: 60,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    color: '#A0AEC0',
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Nom et titre dans la sidebar
  sidebarName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  sidebarTitle: {
    fontSize: 16,
    color: '#A0AEC0', // gray-400
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'normal',
  },
  
  // Sections de la sidebar
  sidebarSection: {
    marginBottom: 35,
  },
  sidebarSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#4299E1', // blue-500
  },
  
  // Contact dans la sidebar
  contactItem: {
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 11,
    color: '#A0AEC0',
    marginBottom: 3,
    fontWeight: 'bold',
  },
  contactValue: {
    fontSize: 12,
    color: '#E2E8F0', // gray-200
    lineHeight: 1.4,
  },
  contactLink: {
    color: '#63B3ED', // blue-300
    textDecoration: 'none',
  },
  
  // Langues avec barres de progression
  languageItem: {
    marginBottom: 15,
  },
  languageName: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  languageBar: {
    height: 8,
    backgroundColor: '#4A5568', // gray-600
    borderRadius: 4,
    overflow: 'hidden',
  },
  languageProgress: {
    height: '100%',
    backgroundColor: '#4299E1', // blue-500
    borderRadius: 4,
  },
  
  // Compétences dans la sidebar
  skillItem: {
    marginBottom: 15,
  },
  skillName: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  skillBar: {
    height: 8,
    backgroundColor: '#4A5568',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    backgroundColor: '#48BB78', // green-500
    borderRadius: 4,
  },
  
  // Section principale à droite
  mainContent: {
    width: '65%',
    backgroundColor: '#ffffff',
    padding: 40,
    paddingTop: 60,
  },
  
  // Sections principales
  mainSection: {
    marginBottom: 40,
  },
  mainSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748', // gray-800
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#2D3748',
  },
  
  // Profil/Summary
  profileText: {
    fontSize: 12,
    color: '#4A5568', // gray-600
    lineHeight: 1.7,
    textAlign: 'justify',
    marginBottom: 20,
  },
  
  // Expériences
  experienceItem: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // gray-200
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  experienceLeft: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 14,
    color: '#4299E1', // blue-500
    fontWeight: 'bold',
    marginBottom: 2,
  },
  experienceDate: {
    fontSize: 12,
    color: '#718096', // gray-500
    fontWeight: 'bold',
  },
  experienceDescription: {
    fontSize: 11,
    color: '#4A5568',
    lineHeight: 1.6,
    textAlign: 'justify',
    marginTop: 8,
  },
  
  // Formation
  educationItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  educationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 3,
  },
  educationInstitution: {
    fontSize: 12,
    color: '#4299E1',
    fontWeight: 'bold',
  },
  educationDate: {
    fontSize: 11,
    color: '#718096',
    fontWeight: 'bold',
  },
  educationDescription: {
    fontSize: 10,
    color: '#4A5568',
    lineHeight: 1.5,
    marginTop: 6,
  },
  
  // Projets
  projectItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6,
  },
  projectDescription: {
    fontSize: 11,
    color: '#4A5568',
    lineHeight: 1.6,
    textAlign: 'justify',
    marginBottom: 8,
  },
  projectTechContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  projectTech: {
    fontSize: 9,
    color: '#4299E1',
    backgroundColor: '#EBF8FF', // blue-50
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BEE3F8', // blue-200
  },
  
  // Expertise/Compétences techniques (dans le main)
  expertiseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  expertiseColumn: {
    flex: 1,
    minWidth: '45%',
  },
  expertiseItem: {
    marginBottom: 12,
  },
  expertiseName: {
    fontSize: 12,
    color: '#2D3748',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  expertiseBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  expertiseProgress: {
    height: '100%',
    backgroundColor: '#2D3748',
    borderRadius: 3,
  },
});

const CVGeneratorModern = ({ cvData, language = 'fr', translations }) => {
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

  // Fonction pour calculer le niveau des langues en pourcentage
  const getLanguageLevel = (level) => {
    const levels = {
      'Débutant': 20,
      'Intermédiaire': 50,
      'Avancé': 75,
      'Courant': 85,
      'Professionnel': 90,
      'Natif': 100,
      'Beginner': 20,
      'Intermediate': 50,
      'Advanced': 75,
      'Fluent': 85,
      'Professional': 90,
      'Native': 100
    };
    return levels[level] || 50;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar sombre */}
        <View style={styles.sidebar}>
          {/* Photo de profil (placeholder) */}
          <View style={styles.profileSection}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>PHOTO</Text>
            </View>
            
            <Text style={styles.sidebarName}>{personalInfo?.name || 'Nom'}</Text>
            <Text style={styles.sidebarTitle}>{personalInfo?.title || 'Titre Professionnel'}</Text>
          </View>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>
            
            {personalInfo?.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email:</Text>
                <Link src={`mailto:${personalInfo.email}`} style={[styles.contactValue, styles.contactLink]}>
                  {personalInfo.email}
                </Link>
              </View>
            )}
            
            {personalInfo?.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Phone:</Text>
                <Text style={styles.contactValue}>{personalInfo.phone}</Text>
              </View>
            )}
            
            {personalInfo?.location && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Address:</Text>
                <Text style={styles.contactValue}>{personalInfo.location}</Text>
              </View>
            )}
            
            {personalInfo?.website && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Website:</Text>
                <Link src={personalInfo.website} style={[styles.contactValue, styles.contactLink]}>
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </Link>
              </View>
            )}
          </View>

          {/* Langues */}
          {languages && languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Languages</Text>
              {languages.map((lang, index) => (
                <View key={index} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <View style={styles.languageBar}>
                    <View style={[styles.languageProgress, { 
                      width: `${getLanguageLevel(lang.level)}%` 
                    }]} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Compétences principales dans la sidebar */}
          {skills && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Skills</Text>
              {skills.filter(skill => skill.level >= 4).slice(0, 6).map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <View style={styles.skillBar}>
                    <View style={[styles.skillProgress, { 
                      width: `${(skill.level / 5) * 100}%` 
                    }]} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Contenu principal */}
        <View style={styles.mainContent}>
          {/* Profil */}
          {personalInfo?.summary && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Profile</Text>
              <Text style={styles.profileText}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Expérience */}
          {experiences && experiences.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Experience</Text>
              {experiences.slice(0, 4).map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <View style={styles.experienceLeft}>
                      <Text style={styles.experienceTitle}>{exp.title}</Text>
                      <Text style={styles.experienceCompany}>{exp.company}</Text>
                    </View>
                    <Text style={styles.experienceDate}>
                      {new Date(exp.start_date).getFullYear()} - {exp.current ? 'Present' : new Date(exp.end_date).getFullYear()}
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
                <View key={index} style={styles.educationItem}>
                  <View style={styles.educationHeader}>
                    <View style={styles.experienceLeft}>
                      <Text style={styles.educationTitle}>{edu.title}</Text>
                      <Text style={styles.educationInstitution}>{edu.company || edu.institution}</Text>
                    </View>
                    <Text style={styles.educationDate}>
                      {new Date(edu.start_date).getFullYear()}
                      {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                    </Text>
                  </View>
                  {edu.description && (
                    <Text style={styles.educationDescription}>{edu.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Expertise technique */}
          {skills && skills.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Expertise</Text>
              <View style={styles.expertiseGrid}>
                <View style={styles.expertiseColumn}>
                  {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, index) => (
                    <View key={index} style={styles.expertiseItem}>
                      <Text style={styles.expertiseName}>{skill.name}</Text>
                      <View style={styles.expertiseBar}>
                        <View style={[styles.expertiseProgress, { 
                          width: `${(skill.level / 5) * 100}%` 
                        }]} />
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.expertiseColumn}>
                  {skills.slice(Math.ceil(skills.length / 2)).map((skill, index) => (
                    <View key={index} style={styles.expertiseItem}>
                      <Text style={styles.expertiseName}>{skill.name}</Text>
                      <View style={styles.expertiseBar}>
                        <View style={[styles.expertiseProgress, { 
                          width: `${(skill.level / 5) * 100}%` 
                        }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Projets */}
          {projects && projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Projects</Text>
              {projects.slice(0, 3).map((project, index) => (
                <View key={index} style={styles.projectItem}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.projectDescription}>{project.description}</Text>
                  {(project.technologies || project.tags) && (
                    <View style={styles.projectTechContainer}>
                      {(project.technologies || project.tags)?.slice(0, 5).map((tech, i) => (
                        <Text key={i} style={styles.projectTech}>{tech}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CVGeneratorModern;