// Générateur de CV dynamique avec React-PDF
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Link
} from '@react-pdf/renderer';

// Styles pour le PDF - Design Ultra-Moderne et Attractif
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  
  // Header moderne avec design asymétrique
  headerSection: {
    backgroundColor: '#0F172A',
    padding: 0,
    position: 'relative',
    height: 220,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '60%',
    height: '100%',
    backgroundColor: '#1E293B',
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    backgroundColor: '#8B5CF6',
    opacity: 0.9,
  },
  headerContent: {
    position: 'relative',
    zIndex: 3,
    padding: 40,
    paddingTop: 50,
  },
  name: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 16,
    color: '#A78BFA',
    marginBottom: 25,
    fontWeight: 'normal',
    letterSpacing: 0.5,
  },
  contactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  contactIcon: {
    width: 8,
    height: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    marginRight: 8,
  },
  contactText: {
    fontSize: 10,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  headerLink: {
    color: '#FDE047',
    textDecoration: 'none',
  },
  
  // Corps du document avec espacement moderne
  bodySection: {
    padding: 35,
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  
  // Layout en colonnes avec design asymétrique
  twoColumns: {
    flexDirection: 'row',
    gap: 25,
  },
  leftColumn: {
    flex: 2.3,
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 12,
  },
  rightColumn: {
    flex: 1.7,
    backgroundColor: '#F8FAFC',
    padding: 25,
    borderRadius: 12,
    border: '1px solid #E2E8F0',
  },
  
  // Sections avec design moderne
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  sectionIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: 1,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  
  // Profil/Summary avec design attractif
  summaryContainer: {
    backgroundColor: '#F0F9FF',
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 30,
    position: 'relative',
  },
  summaryAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: '5px 0 0 5px',
  },
  summaryText: {
    fontSize: 12,
    color: '#0F172A',
    lineHeight: 1.7,
    textAlign: 'justify',
    fontStyle: 'italic',
  },
  
  // Expériences avec design moderne et timeline
  experienceItem: {
    marginBottom: 25,
    paddingLeft: 25,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
    position: 'relative',
    backgroundColor: '#FEFEFE',
    borderRadius: '0 10px 10px 0',
  },
  experienceMarker: {
    position: 'absolute',
    left: -8,
    top: 18,
    width: 14,
    height: 14,
    backgroundColor: '#8B5CF6',
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  experienceLeft: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  experienceLocation: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  experienceDate: {
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: '#8B5CF6',
    padding: '6 12',
    borderRadius: 15,
    textAlign: 'center',
    minWidth: 90,
    fontWeight: 'bold',
  },
  experienceDescription: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 10,
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
  
  // Compétences avec design moderne et barres colorées
  skillCategory: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skillCategoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    letterSpacing: 0.8,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  skillItem: {
    marginBottom: 12,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillName: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  skillLevel: {
    fontSize: 9,
    color: '#ffffff',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  skillBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  
  // Projets avec design attractif et moderne
  projectItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    position: 'relative',
  },
  projectAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  projectContent: {
    paddingLeft: 20,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
    flex: 1,
  },
  projectStatus: {
    fontSize: 8,
    color: '#ffffff',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 10,
    textAlign: 'justify',
  },
  projectTechContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  projectTech: {
    fontSize: 9,
    color: '#8B5CF6',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    fontWeight: '500',
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

const CVDocument = ({ cvData, language = 'fr', translations }) => {
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
        {/* Header Section avec design ultra-moderne */}
        <View style={styles.headerSection}>
          <View style={styles.headerBackground} />
          <View style={styles.headerAccent} />
          <View style={styles.headerContent}>
            <Text style={styles.name}>{personalInfo.name}</Text>
            <Text style={styles.title}>{personalInfo.title}</Text>
            
            <View style={styles.contactContainer}>
              {personalInfo.email && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon} />
                  <Link src={`mailto:${personalInfo.email}`} style={[styles.contactText, styles.headerLink]}>
                    {personalInfo.email}
                  </Link>
                </View>
              )}
              {personalInfo.phone && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon} />
                  <Link src={`tel:${personalInfo.phone}`} style={[styles.contactText, styles.headerLink]}>
                    {personalInfo.phone}
                  </Link>
                </View>
              )}
              {personalInfo.location && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon} />
                  <Text style={styles.contactText}>{personalInfo.location}</Text>
                </View>
              )}
              {personalInfo.website && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon} />
                  <Link src={personalInfo.website} style={[styles.contactText, styles.headerLink]}>
                    {personalInfo.website.replace(/^https?:\/\//, '')}
                  </Link>
                </View>
              )}
              {personalInfo.linkedin && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon} />
                  <Link src={personalInfo.linkedin} style={[styles.contactText, styles.headerLink]}>
                    LinkedIn
                  </Link>
                </View>
              )}
              {personalInfo.github && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon} />
                  <Link src={personalInfo.github} style={[styles.contactText, styles.headerLink]}>
                    GitHub
                  </Link>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Corps du document */}
        <View style={styles.bodySection}>
          {/* Profil/Summary avec design attractif */}
          {personalInfo.summary && (
            <View style={styles.summaryContainer}>
              <View style={styles.summaryAccent} />
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
                    <Text style={styles.sectionTitle}>{t('sections.experience', 'EXPÉRIENCE')}</Text>
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
                          {new Date(exp.start_date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'fr-FR', { 
                            month: 'short', 
                            year: 'numeric' 
                          })} - {exp.current ? t('labels.present', 'Présent') : 
                            new Date(exp.end_date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'fr-FR', { 
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
                    <Text style={styles.sectionTitle}>{t('sections.projects', 'PROJETS CLÉS')}</Text>
                  </View>
                  <View style={styles.sectionDivider} />
                  
                  {projects.slice(0, 3).map((project, index) => (
                    <View key={index} style={styles.projectItem}>
                      <View style={styles.projectAccent} />
                      <View style={styles.projectContent}>
                        <View style={styles.projectHeader}>
                          <Text style={styles.projectTitle}>{project.title}</Text>
                          <Text style={styles.projectStatus}>{project.status || 'Completed'}</Text>
                        </View>
                        <Text style={styles.projectDescription}>{project.description}</Text>
                        {(project.tags || project.technologies) && (
                          <View style={styles.projectTechContainer}>
                            {(project.tags || project.technologies)?.slice(0, 5).map((tech, i) => (
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
                    <Text style={styles.sectionTitle}>{t('sections.skills', 'COMPÉTENCES')}</Text>
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
                        {t(`skillCategories.${category}`, category.charAt(0).toUpperCase() + category.slice(1))}
                      </Text>
                      {categorySkills.slice(0, 6).map((skill, index) => (
                        <View key={index} style={styles.skillItem}>
                          <View style={styles.skillHeader}>
                            <Text style={styles.skillName}>{skill.name}</Text>
                            <Text style={styles.skillLevel}>
                              {skill.years_experience ? `${skill.years_experience} ${t('labels.years', 'ans')}` : `${t('labels.level', 'Niveau')} ${skill.level}/5`}
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
                    <Text style={styles.sectionTitle}>{t('sections.education', 'FORMATION')}</Text>
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
                    <Text style={styles.sectionTitle}>{t('sections.languages', 'LANGUES')}</Text>
                  </View>
                  {languages.map((lang, index) => (
                    <View key={index} style={styles.languageItem}>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <Text style={styles.languageLevel}>{t(`languageLevels.${lang.level}`, lang.level)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Réalisations avec icônes */}
              {achievements && achievements.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>{t('sections.achievements', 'RÉALISATIONS')}</Text>
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
              {t('interface.cvGenerated', 'CV généré automatiquement')} • {new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'fr-FR')}
            </Text>
            <View style={styles.generatedBadge}>
              <Text style={styles.generatedText}>
                ⚡ {t('interface.generatedFromDB', 'Généré depuis la base de données')}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVDocument;