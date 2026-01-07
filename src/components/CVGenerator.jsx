// Générateur CV simple et cohérent avec le portfolio
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

// Styles simples et cohérents avec le portfolio
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 40,
  },
  
  // Header avec photo et infos principales
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  
  // Section photo
  photoSection: {
    width: 120,
    marginRight: 30,
    alignItems: 'center',
  },
  
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  
  // Infos principales
  mainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  
  title: {
    fontSize: 18,
    color: '#8B5CF6',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  
  // Contact en ligne
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  
  contactItem: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  
  contactLink: {
    color: '#8B5CF6',
    textDecoration: 'none',
  },
  
  // Sections principales
  section: {
    marginBottom: 25,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#8B5CF6',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Profil/Summary
  summary: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 1.6,
    textAlign: 'justify',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  
  // Layout deux colonnes
  twoColumns: {
    flexDirection: 'row',
    gap: 30,
  },
  
  leftColumn: {
    flex: 2,
  },
  
  rightColumn: {
    flex: 1,
  },
  
  // Expériences
  experienceItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  experienceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 3,
  },
  
  experienceCompany: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  
  experienceLocation: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
  },
  
  experienceDate: {
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  experienceDescription: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  
  // Compétences simples
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  skillItem: {
    fontSize: 10,
    color: '#8B5CF6',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    fontWeight: '500',
  },
  
  // Projets
  projectItem: {
    marginBottom: 15,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#06B6D4',
  },
  
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
  },
  
  projectDescription: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.4,
    marginBottom: 8,
  },
  
  projectTechs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  
  projectTech: {
    fontSize: 8,
    color: '#06B6D4',
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06B6D4',
  },
  
  // Formation
  educationItem: {
    marginBottom: 12,
  },
  
  educationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  
  educationInstitution: {
    fontSize: 11,
    color: '#8B5CF6',
    marginBottom: 2,
  },
  
  educationDate: {
    fontSize: 10,
    color: '#64748B',
  },
  
  // Footer
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  generatedText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

const CVDocument = ({ cvData, language = 'fr' }) => {
  const {
    personalInfo,
    experiences,
    skills,
    projects,
    education
  } = cvData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header avec photo GitHub */}
        <View style={styles.header}>
          <View style={styles.photoSection}>
            <Image 
              src="https://avatars.githubusercontent.com/u/169470778?v=4"
              style={styles.photo}
            />
          </View>
          
          <View style={styles.mainInfo}>
            <Text style={styles.name}>{personalInfo?.name || 'Sebbe Mercier'}</Text>
            <Text style={styles.title}>{personalInfo?.title || 'Développeur Full Stack'}</Text>
            
            <View style={styles.contactRow}>
              {personalInfo?.email && (
                <Link src={`mailto:${personalInfo.email}`} style={[styles.contactItem, styles.contactLink]}>
                  {personalInfo.email}
                </Link>
              )}
              {personalInfo?.phone && (
                <Text style={styles.contactItem}>{personalInfo.phone}</Text>
              )}
              {personalInfo?.website && (
                <Link src={personalInfo.website} style={[styles.contactItem, styles.contactLink]}>
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </Link>
              )}
              {personalInfo?.github && (
                <Link src={personalInfo.github} style={[styles.contactItem, styles.contactLink]}>
                  GitHub
                </Link>
              )}
            </View>
          </View>
        </View>

        {/* Profil/Summary */}
        {personalInfo?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Layout deux colonnes */}
        <View style={styles.twoColumns}>
          {/* Colonne gauche - Expériences */}
          <View style={styles.leftColumn}>
            {/* Expérience Professionnelle */}
            {experiences && experiences.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Expérience</Text>
                {experiences.slice(0, 4).map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <View style={{ flex: 1 }}>
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

            {/* Projets */}
            {projects && projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projets</Text>
                {projects.slice(0, 3).map((project, index) => (
                  <View key={index} style={styles.projectItem}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <Text style={styles.projectDescription}>{project.description}</Text>
                    {(project.technologies || project.tags) && (
                      <View style={styles.projectTechs}>
                        {(project.technologies || project.tags)?.slice(0, 4).map((tech, i) => (
                          <Text key={i} style={styles.projectTech}>{tech}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Colonne droite - Compétences et Formation */}
          <View style={styles.rightColumn}>
            {/* Compétences */}
            {skills && skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Compétences</Text>
                <View style={styles.skillsGrid}>
                  {skills.slice(0, 12).map((skill, index) => (
                    <Text key={index} style={styles.skillItem}>
                      {skill.name}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Formation */}
            {education && education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Formation</Text>
                {education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <Text style={styles.educationTitle}>{edu.title}</Text>
                    <Text style={styles.educationInstitution}>{edu.company || edu.institution}</Text>
                    <Text style={styles.educationDate}>
                      {new Date(edu.start_date).getFullYear()}
                      {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            CV généré automatiquement • {new Date().toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.generatedBadge}>
            <Text style={styles.generatedText}>
              ⚡ Portfolio
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVDocument;