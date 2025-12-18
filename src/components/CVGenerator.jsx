// Générateur de CV dynamique avec React-PDF
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font,
  Link,
  Image
} from '@react-pdf/renderer';

// Styles pour le PDF - Design Moderne et Professionnel
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  
  // Header avec gradient visuel
  headerSection: {
    backgroundColor: '#1F2937',
    padding: 40,
    position: 'relative',
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: '100%',
    backgroundColor: '#8B5CF6',
    opacity: 0.1,
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    color: '#8B5CF6',
    marginBottom: 20,
    fontWeight: 'normal',
  },
  contactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
    marginRight: 8,
  },
  contactText: {
    fontSize: 11,
    color: '#E5E7EB',
  },
  
  // Corps du document
  bodySection: {
    padding: 30,
    flex: 1,
  },
  
  // Layout en colonnes
  twoColumns: {
    flexDirection: 'row',
    gap: 30,
  },
  leftColumn: {
    flex: 2.2,
  },
  rightColumn: {
    flex: 1.8,
    backgroundColor: '#F8FAFC',
    padding: 25,
    borderRadius: 8,
    marginLeft: 10,
  },
  
  // Sections
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 15,
    borderRadius: 1,
  },
  
  // Profil/Summary avec style moderne
  summaryContainer: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    marginBottom: 25,
  },
  summaryText: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  
  // Expériences avec timeline visuelle
  experienceItem: {
    marginBottom: 20,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    position: 'relative',
  },
  experienceMarker: {
    position: 'absolute',
    left: -6,
    top: 5,
    width: 10,
    height: 10,
    backgroundColor: '#8B5CF6',
    borderRadius: 5,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
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
    color: '#6B7280',
    fontStyle: 'italic',
  },
  experienceDate: {
    fontSize: 10,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    padding: '4 8',
    borderRadius: 4,
    textAlign: 'center',
    minWidth: 80,
  },
  experienceDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 8,
    textAlign: 'justify',
  },
  achievementsList: {
    marginTop: 8,
  },
  achievement: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 3,
    paddingLeft: 12,
    position: 'relative',
  },
  achievementBullet: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 4,
    height: 4,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  
  // Compétences avec barres de progression visuelles
  skillCategory: {
    marginBottom: 20,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillItem: {
    marginBottom: 8,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  skillName: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
  },
  skillLevel: {
    fontSize: 9,
    color: '#6B7280',
  },
  skillBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  
  // Projets avec cards modernes
  projectItem: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  projectAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  projectContent: {
    paddingLeft: 15,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  projectDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 8,
    textAlign: 'justify',
  },
  projectTechContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  projectTech: {
    fontSize: 8,
    color: '#8B5CF6',
    backgroundColor: '#F0F9FF',
    padding: '2 6',
    borderRadius: 3,
    border: '1px solid #DBEAFE',
  },
  
  // Langues avec indicateurs visuels
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  languageName: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  languageLevel: {
    fontSize: 9,
    color: '#8B5CF6',
    backgroundColor: '#F0F9FF',
    padding: '3 8',
    borderRadius: 4,
    border: '1px solid #DBEAFE',
  },
  
  // Réalisations avec style moderne
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  achievementIcon: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 3,
  },
  achievementText: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
    lineHeight: 1.4,
  },
  
  // Footer avec informations générées
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  generatedBadge: {
    backgroundColor: '#F0F9FF',
    padding: '4 8',
    borderRadius: 4,
    border: '1px solid #DBEAFE',
  },
  generatedText: {
    fontSize: 8,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  
  // Liens avec style
  link: {
    color: '#8B5CF6',
    textDecoration: 'none',
  },
});

const CVDocument = ({ cvData }) => {
  const {
    personalInfo,
    experiences,
    skills,
    projects,
    education,
    languages,
    achievements
  } = cvData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section avec design moderne */}
        <View style={styles.headerSection}>
          <View style={styles.headerAccent} />
          <View style={styles.headerContent}>
            <Text style={styles.name}>{personalInfo.name}</Text>
            <Text style={styles.title}>{personalInfo.title}</Text>
            
            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Text style={styles.contactText}>{personalInfo.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Text style={styles.contactText}>{personalInfo.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Text style={styles.contactText}>{personalInfo.location}</Text>
              </View>
              <View style={styles.contactItem}>
                <View style={styles.contactIcon} />
                <Link src={personalInfo.website} style={[styles.contactText, styles.link]}>
                  {personalInfo.website}
                </Link>
              </View>
            </View>
          </View>
        </View>

        {/* Corps du document */}
        <View style={styles.bodySection}>
          {/* Profil/Summary avec style moderne */}
          {personalInfo.summary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Layout en deux colonnes */}
          <View style={styles.twoColumns}>
            {/* Colonne de gauche - Expériences et Projets */}
            <View style={styles.leftColumn}>
              {/* Expérience Professionnelle avec timeline */}
              {experiences && experiences.filter(exp => exp.type === 'work').length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>Expérience</Text>
                  </View>
                  <View style={styles.sectionDivider} />
                  
                  {experiences.filter(exp => exp.type === 'work').map((exp, index) => (
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
                      <Text style={styles.experienceDescription}>{exp.description}</Text>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <View style={styles.achievementsList}>
                          {exp.achievements.map((achievement, i) => (
                            <View key={i} style={styles.achievement}>
                              <View style={styles.achievementBullet} />
                              <Text style={[styles.achievement, { paddingLeft: 0 }]}>
                                {achievement}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Projets Clés avec cards modernes */}
              {projects && projects.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>Projets Clés</Text>
                  </View>
                  <View style={styles.sectionDivider} />
                  
                  {projects.slice(0, 3).map((project, index) => (
                    <View key={index} style={styles.projectItem}>
                      <View style={styles.projectAccent} />
                      <View style={styles.projectContent}>
                        <Text style={styles.projectTitle}>{project.title}</Text>
                        <Text style={styles.projectDescription}>{project.description}</Text>
                        {project.technologies && (
                          <View style={styles.projectTechContainer}>
                            {project.technologies.slice(0, 5).map((tech, i) => (
                              <Text key={i} style={styles.projectTech}>{tech}</Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Colonne de droite - Compétences, Formation, etc. */}
            <View style={styles.rightColumn}>
              {/* Compétences avec barres de progression */}
              {skills && skills.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>Compétences</Text>
                  </View>
                  
                  {Object.entries(
                    skills.reduce((acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {})
                  ).map(([category, categorySkills]) => (
                    <View key={category} style={styles.skillCategory}>
                      <Text style={styles.skillCategoryTitle}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                      {categorySkills.slice(0, 6).map((skill, index) => (
                        <View key={index} style={styles.skillItem}>
                          <View style={styles.skillHeader}>
                            <Text style={styles.skillName}>{skill.name}</Text>
                            <Text style={styles.skillLevel}>
                              {skill.years_experience ? `${skill.years_experience} ans` : `Niveau ${skill.level}/5`}
                            </Text>
                          </View>
                          <View style={styles.skillBar}>
                            <View style={[styles.skillProgress, { 
                              width: `${(skill.level / 5) * 100}%` 
                            }]} />
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              {/* Formation */}
              {education && education.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>Formation</Text>
                  </View>
                  {education.map((edu, index) => (
                    <View key={index} style={styles.experienceItem}>
                      <View style={styles.experienceMarker} />
                      <Text style={styles.experienceTitle}>{edu.title}</Text>
                      <Text style={styles.experienceCompany}>{edu.company}</Text>
                      <Text style={styles.experienceDate}>
                        {new Date(edu.start_date).getFullYear()}
                        {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Langues avec indicateurs visuels */}
              {languages && languages.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>Langues</Text>
                  </View>
                  {languages.map((lang, index) => (
                    <View key={index} style={styles.languageItem}>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <Text style={styles.languageLevel}>{lang.level}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Réalisations avec icônes */}
              {achievements && achievements.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>Réalisations</Text>
                  </View>
                  {achievements.map((achievement, index) => (
                    <View key={index} style={styles.achievementItem}>
                      <View style={styles.achievementIcon} />
                      <Text style={styles.achievementText}>{achievement}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Footer avec informations de génération */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              CV généré automatiquement • {new Date().toLocaleDateString('fr-FR')}
            </Text>
            <View style={styles.generatedBadge}>
              <Text style={styles.generatedText}>
                ⚡ Généré depuis la base de données
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVDocument;